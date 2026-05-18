#!/usr/bin/env bash
# 未来专业人格卡 H5 —— 开发服务器管理脚本
# 用法： ./run.sh {start|stop|restart|status}
#   start    启动开发服务器（已在运行则不重复启动）
#   stop     停止所有本项目的服务进程（含历史遗留的多个实例）
#   restart  先 stop 再 start
#   status   查看运行状态
set -u

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUN_DIR="$PROJECT_DIR/.run"
PID_FILE="$RUN_DIR/server.pids"
LOG_FILE="$RUN_DIR/server.log"
PORT="${PORT:-5173}"

# 找出所有属于本项目的 vite 进程 pid
# 三重判定：① 可执行文件必须是 node（排除恰好命令行含 "vite" 的 shell）
#           ② 工作目录在本项目内  ③ 命令行确为 vite 服务器
find_pids() {
  local pid cwd cmd comm
  for pid in $(pgrep -f 'node_modules' 2>/dev/null); do
    comm="$(cat "/proc/$pid/comm" 2>/dev/null)" || continue
    [[ "$comm" == node ]] || continue
    cwd="$(readlink "/proc/$pid/cwd" 2>/dev/null)" || continue
    case "$cwd" in
      "$PROJECT_DIR"|"$PROJECT_DIR"/*) ;;
      *) continue ;;
    esac
    cmd="$(tr '\0' ' ' < "/proc/$pid/cmdline" 2>/dev/null)" || continue
    case "$cmd" in
      *vitest*) continue ;;                # 排除单元测试进程
      *node_modules*vite*) echo "$pid" ;;  # vite 开发/预览服务器
    esac
  done
}

# 收集需要清理的进程组 ID（来源：pid 文件 + 实时扫描）
collect_pgids() {
  local p pid pgid
  if [[ -f "$PID_FILE" ]]; then
    while read -r p; do [[ -n "$p" ]] && echo "$p"; done < "$PID_FILE"
  fi
  for pid in $(find_pids); do
    pgid="$(ps -o pgid= -p "$pid" 2>/dev/null | tr -d ' ')"
    [[ -n "$pgid" ]] && echo "$pgid"
  done
}

start() {
  mkdir -p "$RUN_DIR"
  if [[ -n "$(find_pids)" ]]; then
    echo "✓ 服务已在运行： http://localhost:$PORT"
    echo "  如需重启： $0 restart"
    return 0
  fi
  : > "$LOG_FILE"
  # setsid 让服务进程自成会话/进程组，便于 stop 时整组清理
  setsid bash -c "cd '$PROJECT_DIR' && exec npm run dev" >> "$LOG_FILE" 2>&1 &
  local pid=$!
  echo "$pid" >> "$PID_FILE"

  # 等待就绪（最多 ~20s）
  local i
  for i in $(seq 1 40); do
    if grep -q "ready in" "$LOG_FILE" 2>/dev/null; then
      echo "✓ 启动成功： http://localhost:$PORT"
      echo "  日志： $LOG_FILE"
      return 0
    fi
    if ! kill -0 "$pid" 2>/dev/null && [[ -z "$(find_pids)" ]]; then
      echo "✗ 启动失败，日志末尾："
      tail -n 15 "$LOG_FILE"
      return 1
    fi
    sleep 0.5
  done
  echo "⚠ 启动超时，请查看日志： $LOG_FILE"
  return 1
}

stop() {
  local pgids targets=() count=0 g self_pgid
  self_pgid="$(ps -o pgid= -p $$ 2>/dev/null | tr -d ' ')"
  pgids="$(collect_pgids | sort -u)"
  # 过滤非法 / 危险的进程组（空、≤1、本脚本自身所在组）
  for g in $pgids; do
    [[ "$g" =~ ^[0-9]+$ ]] || continue
    [[ "$g" -le 1 ]] && continue
    [[ -n "$self_pgid" && "$g" == "$self_pgid" ]] && continue
    targets+=("$g")
  done
  if [[ ${#targets[@]} -eq 0 ]]; then
    echo "没有正在运行的服务"
    rm -f "$PID_FILE"
    return 0
  fi
  # 先 TERM 温和退出
  for g in "${targets[@]}"; do
    kill -TERM -"$g" 2>/dev/null && count=$((count + 1))
  done
  sleep 1
  # 再 KILL 兜底，确保全部停掉
  for g in "${targets[@]}"; do
    kill -KILL -"$g" 2>/dev/null
  done
  rm -f "$PID_FILE"
  echo "✓ 已停止 $count 个服务进程组"
}

status() {
  local pids
  pids="$(find_pids)"
  if [[ -n "$pids" ]]; then
    echo "● 运行中 (pid: $(echo "$pids" | tr '\n' ' '))  http://localhost:$PORT"
  else
    echo "○ 未运行"
  fi
}

case "${1:-}" in
  start)   start ;;
  stop)    stop ;;
  restart) stop; sleep 1; start ;;
  status)  status ;;
  *)
    echo "用法： $0 {start|stop|restart|status}"
    exit 1
    ;;
esac

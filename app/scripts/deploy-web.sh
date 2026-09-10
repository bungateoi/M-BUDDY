#!/bin/bash
# Build bản web (Expo export) + deploy lên Vercel (link cố định, không đổi mỗi lần deploy).
# Dùng: bash scripts/deploy-web.sh
set -e
cd "$(dirname "$0")/.."

npx expo export -p web

# Vercel mặc định bỏ qua mọi thư mục tên "node_modules" khi upload — font/icon
# của Expo lại nằm ở assets/node_modules/... nên bị 404 nếu không đổi tên.
cd dist
if [ -d assets/node_modules ]; then
  sed -i '' 's#assets/node_modules#assets/vendor-fonts#g' _expo/static/js/web/*.js
  mv assets/node_modules assets/vendor-fonts
fi

DEPLOY_OUTPUT=$(npx vercel deploy --prod --yes)
echo "$DEPLOY_OUTPUT"

# vercel alias không tự trỏ theo mỗi lần deploy — phải gán lại thủ công mỗi
# lần, nếu không mbuddy.vercel.app sẽ tiếp tục phục vụ bản CŨ dù deploy mới
# đã chạy xong (đã gặp thật khi test link không cập nhật).
DEPLOY_URL=$(echo "$DEPLOY_OUTPUT" | grep -o '"url": *"[^"]*"' | head -1 | sed -E 's/.*"url": *"([^"]*)".*/\1/')
if [ -n "$DEPLOY_URL" ]; then
  # Field "url" trong JSON có lúc trả về kèm sẵn "https://", có lúc chỉ trả
  # hostname trần — chuẩn hoá trước khi gán để không bị dính "https://https://".
  case "$DEPLOY_URL" in
    http://*|https://*) FULL_URL="$DEPLOY_URL" ;;
    *) FULL_URL="https://$DEPLOY_URL" ;;
  esac
  npx vercel alias set "$FULL_URL" mbuddy.vercel.app
else
  echo "CẢNH BÁO: không lấy được URL deployment để gán alias — chạy tay: npx vercel alias set <url-production-vừa-in-ở-trên> mbuddy.vercel.app"
fi

#!/bin/bash
# Build bản web (Expo export) + deploy lên Vercel, project mbuddy-v2 (đúng
# domain https://mbuddy-v2.vercel.app — đây là domain mặc định của project,
# TỰ trỏ sang bản mới nhất mỗi lần deploy production, không cần alias tay).
# Dùng: bash scripts/deploy-web.sh
#
# LƯU Ý: phải deploy bằng `vercel deploy dist --prod --project mbuddy-v2`
# chạy từ app/ (không phải `cd dist && vercel deploy`) — nếu cd vào dist/
# rồi deploy từ đó, Vercel CLI không thấy .vercel/project.json ở app/ nên
# tự tạo/deploy nhầm sang 1 project khác tên "dist" (đã xảy ra thật).
set -e
cd "$(dirname "$0")/.."

npx expo export -p web

# Vercel mặc định bỏ qua mọi thư mục tên "node_modules" khi upload — font/icon
# của Expo lại nằm ở assets/node_modules/... nên bị 404 nếu không đổi tên.
if [ -d dist/assets/node_modules ]; then
  sed -i '' 's#assets/node_modules#assets/vendor-fonts#g' dist/_expo/static/js/web/*.js
  mv dist/assets/node_modules dist/assets/vendor-fonts
fi

npx vercel deploy dist --prod --yes --project mbuddy-v2

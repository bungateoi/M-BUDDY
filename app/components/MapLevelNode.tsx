import { SvgXml } from 'react-native-svg';
import type { LevelStatus } from '../data/types';

// 2 asset gốc từ Figma (node-id=76:5842, "Bản đồ") — mỗi asset đã bao gồm
// sẵn hiệu ứng bóng đổ "sticker" (feDropShadow) dưới vòng tròn, không cần
// dựng lại bằng shadow CSS. Figma chỉ thiết kế 2 biến thể (Default=khoá,
// Variant2=mở khoá/ngôi sao) — KHÔNG có biến thể riêng cho "đã hoàn thành",
// nên 'current' và 'completed' dùng chung 1 hình (Variant2); chỉ 'locked'
// khác biệt. Logic 3 trạng thái ở MapScreen#resolveStatus giữ nguyên,
// chỉ gộp hình ở bước hiển thị cuối cùng này. Node khoá đổi từ xanh
// (#4E8FFF, bản Figma cũ 30:1819) sang xám (#C1C1C1, colors2.lockedGray)
// khớp thiết kế nền đen mới.
const LEVEL_LOCKED_XML = `<svg width="80" height="70" viewBox="0 0 80 70" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Level">
<g id="Podium" filter="url(#filter0_d_0_181)">
<ellipse cx="40" cy="32" rx="40" ry="32" fill="#C1C1C1"/>
</g>
<path id="Subtract" d="M40.2998 16C42.6867 16 44.9763 16.9471 46.6641 18.6328C48.3517 20.3185 49.2998 22.6054 49.2998 24.9893V29.3037H50.3799C52.7657 29.3038 54.7002 31.2353 54.7002 33.6182V43.6855C54.7002 46.0684 52.7657 47.9999 50.3799 48H30.2207C27.8348 48 25.9004 46.0684 25.9004 43.6855V33.6182C25.9004 31.2353 27.8348 29.3037 30.2207 29.3037H31.2998V24.9893C31.2998 22.6054 32.2478 20.3185 33.9355 18.6328C35.6234 16.9471 37.9129 16 40.2998 16ZM40.2998 33.6182C38.7097 33.6185 37.4202 34.906 37.4199 36.4941C37.4199 37.5573 37.9995 38.4836 38.8584 38.9814V42.2471C38.8584 43.0412 39.5037 43.6853 40.2988 43.6855C41.0939 43.6853 41.7383 43.0412 41.7383 42.2471V38.9834C42.5991 38.486 43.1797 37.5588 43.1797 36.4941C43.1794 34.9059 41.8901 33.6182 40.2998 33.6182ZM40.2998 19.5957C38.8678 19.5957 37.4941 20.1635 36.4814 21.1748C35.4687 22.1862 34.8994 23.5589 34.8994 24.9893V29.3037H45.7002V24.9893C45.7002 23.5589 45.1308 22.1862 44.1182 21.1748C43.1055 20.1635 41.7318 19.5957 40.2998 19.5957Z" fill="white" fill-opacity="0.6"/>
</g>
<defs>
<filter id="filter0_d_0_181" x="0" y="0" width="80" height="70" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="6"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.55018 0 0 0 0 0.55018 0 0 0 0 0.55018 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_181"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_181" result="shape"/>
</filter>
</defs>
</svg>`;

const LEVEL_UNLOCKED_XML = `<svg width="80" height="70" viewBox="0 0 80 70" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Level">
<g id="Podium" filter="url(#filter0_d_0_178)">
<ellipse cx="40" cy="32" rx="40" ry="32" fill="url(#paint0_linear_0_178)"/>
</g>
<g id="Union">
<path fill-rule="evenodd" clip-rule="evenodd" d="M50.0622 37.1994C50.0656 37.1962 50.059 37.2026 50.0622 37.1994Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M40.0332 16C40.5105 16.0002 40.9787 16.138 41.3808 16.3972C41.7742 16.6509 42.0886 17.0117 42.29 17.4361L46.1692 25.3349L46.1892 25.3816C46.1932 25.3906 46.1998 25.3991 46.2078 25.405L46.2355 25.4143L46.2788 25.4206L54.8382 26.7009C55.3012 26.7652 55.7365 26.9585 56.0962 27.2601C56.4156 27.528 56.664 27.8714 56.8187 28.2586L56.8789 28.4268C57.0241 28.8822 57.0397 29.3723 56.9205 29.8365C56.8043 30.289 56.5637 30.6983 56.2305 31.0218L50.0622 37.1994L50.036 37.2243C50.0231 37.2365 50.0135 37.2519 50.0082 37.2679L50.0051 37.3209L51.4931 46.0125L51.5163 46.1885C51.5583 46.6016 51.5006 47.0206 51.345 47.4081C51.1671 47.8495 50.8693 48.2338 50.4867 48.514C50.1034 48.7946 49.6485 48.9592 49.1762 48.9922C48.7035 49.0256 48.2331 48.9258 47.8162 48.7025L40.1444 44.6106L40.0904 44.5904C40.0718 44.5859 40.0522 44.5842 40.0332 44.5841C39.9954 44.5841 39.957 44.5935 39.9221 44.6106L32.2487 48.7009C31.8317 48.9244 31.36 49.0271 30.8872 48.9938C30.4157 48.9606 29.9613 48.7945 29.5782 48.514C29.196 48.234 28.8992 47.8498 28.7215 47.4081C28.5441 46.9669 28.4916 46.4846 28.5718 46.0156L30.0599 37.2305C30.0628 37.2134 30.0621 37.1879 30.0568 37.1713L30.029 37.1262L30.0151 37.1137L23.7804 31.0405C23.4295 30.7044 23.1817 30.2738 23.0688 29.7991C22.9559 29.324 22.9825 28.8249 23.1444 28.3645C23.3064 27.9043 23.5969 27.501 23.9811 27.2041C24.3437 26.9239 24.7754 26.7499 25.2283 26.6994L33.7862 25.4206C33.797 25.4189 33.8189 25.4155 33.8294 25.4143C33.8389 25.4132 33.8494 25.4106 33.8572 25.405C33.865 25.3991 33.8718 25.3905 33.8757 25.3816L33.8973 25.3349L37.7749 17.4361C37.9762 17.0119 38.291 16.6524 38.6841 16.3988C39.0865 16.1394 39.5557 16 40.0332 16Z" fill="white"/>
</g>
</g>
<defs>
<filter id="filter0_d_0_178" x="0" y="0" width="80" height="70" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="6"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.804462 0 0 0 0 0.335193 0 0 0 0 0 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_178"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_178" result="shape"/>
</filter>
<linearGradient id="paint0_linear_0_178" x1="40" y1="0" x2="40" y2="64" gradientUnits="userSpaceOnUse">
<stop stop-color="#FEBC1D"/>
<stop offset="1" stop-color="#FB6616"/>
</linearGradient>
</defs>
</svg>`;

export function MapLevelNode({ status }: { status: LevelStatus; size?: number }) {
  const xml = status === 'locked' ? LEVEL_LOCKED_XML : LEVEL_UNLOCKED_XML;
  return <SvgXml xml={xml} width={80} height={70} />;
}

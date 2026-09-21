// Trang trí ven đường màn Bản đồ (node-id=76-5842) — SVG tải nguyên trạng
// từ Figma "Hackathon", lưu thô tại app/assets/v2/map2/*.svg (không dùng
// react-native-svg-transformer — dự án chưa cài, xem icons2.tsx cho quy ước
// tương tự: nhúng nguyên XML rồi render bằng SvgXml thay vì import trực
// tiếp file .svg).
import { View, type ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';

const VEHICLE_CAR_XML = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="60.2204" height="60.2204" viewBox="0 0 60.2204 60.2204" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="OBJECTS" clip-path="url(#clip0_0_219)">
<path id="Vector" d="M34.1729 13.5626L35.6866 22.0514" stroke="url(#paint0_linear_0_219)" stroke-miterlimit="10"/>
<path id="Vector_2" d="M46.658 26.0478L38.1692 24.5341" stroke="url(#paint1_linear_0_219)" stroke-miterlimit="10"/>
<path id="Vector_3" d="M6.57588 41.7294L11.9162 40.1794" stroke="url(#paint2_linear_0_219)" stroke-miterlimit="10"/>
<path id="Vector_4" d="M18.4912 53.645L20.0412 48.3047" stroke="url(#paint3_linear_0_219)" stroke-miterlimit="10"/>
<path id="Vector_5" d="M9.10532 44.9623L7.98361 43.8406L5.10656 46.7177L6.22827 47.8394L9.10532 44.9623Z" fill="url(#paint4_linear_0_219)"/>
<path id="Vector_6" d="M12.7508 48.5987L11.629 47.477L8.75199 50.354L9.8737 51.4757L12.7508 48.5987Z" fill="url(#paint5_linear_0_219)"/>
<path id="Vector_7" d="M16.3832 52.2228L15.2615 51.1011L12.3844 53.9781L13.5062 55.0998L16.3832 52.2228Z" fill="url(#paint6_linear_0_219)"/>
<path id="Vector_8" d="M33.8218 11.2255L40.2398 17.6556L37.2003 20.0533L35.2991 15.2943L32.5261 12.5212L33.8218 11.2255Z" fill="url(#paint7_linear_0_219)"/>
<path id="Vector_9" d="M28.5905 14.1196C28.1113 13.6365 27.8424 12.9837 27.8424 12.3032C27.8424 11.6228 28.1113 10.9699 28.5905 10.4868L31.085 7.99226C31.3226 7.75207 31.6055 7.56141 31.9173 7.43128C32.2291 7.30115 32.5636 7.23414 32.9014 7.23414C33.2393 7.23414 33.5738 7.30115 33.8856 7.43128C34.1974 7.56141 34.4802 7.75207 34.7179 7.99226C34.9566 8.23068 35.146 8.51383 35.2752 8.8255C35.4044 9.13718 35.4709 9.47128 35.4709 9.80868C35.4709 10.1461 35.4044 10.4802 35.2752 10.7919C35.146 11.1035 34.9566 11.3867 34.7179 11.6251L32.2112 14.1318C31.7286 14.6086 31.0768 14.875 30.3984 14.8727C29.7199 14.8705 29.0699 14.5997 28.5905 14.1196Z" fill="url(#paint8_linear_0_219)"/>
<path id="Vector_10" d="M48.9826 26.3982L42.5646 19.9681L40.1548 23.0196L44.9138 24.9208L47.699 27.6939L48.9826 26.3982Z" fill="url(#paint9_linear_0_219)"/>
<path id="Vector_11" d="M46.0887 31.63C46.5718 32.1091 47.2247 32.378 47.9051 32.378C48.5856 32.378 49.2384 32.1091 49.7215 31.63L52.2161 29.1233C52.6953 28.6402 52.9641 27.9873 52.9641 27.3069C52.9641 26.6264 52.6953 25.9735 52.2161 25.4904C51.733 25.0113 51.0801 24.7424 50.3997 24.7424C49.7192 24.7424 49.0663 25.0113 48.5832 25.4904L46.0766 27.9971C45.599 28.4818 45.3323 29.1356 45.3345 29.816C45.3368 30.4965 45.6079 31.1485 46.0887 31.63Z" fill="url(#paint10_linear_0_219)"/>
<path id="Vector_12" d="M49.2008 8.85203L40.3488 0L36.7644 3.58441L42.2379 9.05789H45.7496L47.3844 10.6806L49.2008 8.85203Z" fill="url(#paint11_linear_0_219)"/>
<path id="Vector_13" d="M35.3597 4.98911L40.3488 -7.39104e-06L41.3417 0.992979L37.3456 4.98911C37.0822 5.25236 36.7251 5.40024 36.3526 5.40024C35.9802 5.40024 35.6231 5.25236 35.3597 4.98911Z" fill="url(#paint12_linear_0_219)"/>
<path id="Vector_14" d="M51.3563 11.0075L60.2204 19.8717L56.636 23.4561L51.1625 17.9826V14.4587L49.5399 12.836L51.3563 11.0075Z" fill="url(#paint13_linear_0_219)"/>
<path id="Vector_15" d="M55.2198 24.861L60.221 19.8598L59.2159 18.8668L55.2198 22.8629C54.9587 23.1299 54.8125 23.4885 54.8125 23.8619C54.8125 24.2354 54.9587 24.594 55.2198 24.861Z" fill="url(#paint14_linear_0_219)"/>
<path id="Vector_16" d="M16.3482 28.5663L14.1564 30.7702C13.0651 31.8582 12.1994 33.151 11.6092 34.5746C11.019 35.9981 10.7159 37.5242 10.7173 39.0652V42.807L9.19152 44.3328L12.5337 47.675L19.3998 40.7968L16.3482 28.5663Z" fill="url(#paint15_linear_0_219)"/>
<path id="Vector_17" d="M31.63 43.8605L29.4381 46.0523C28.3472 47.143 27.052 48.0081 25.6267 48.5982C24.2013 49.1882 22.6737 49.4918 21.131 49.4914H17.3771L15.8876 51.0172L12.5333 47.6508L19.3994 40.7726L31.63 43.8605Z" fill="url(#paint16_linear_0_219)"/>
<path id="Vector_18" d="M11.832 48.3823L19.6925 56.2429L21.0711 54.8643L13.2106 47.0037L11.832 48.3823Z" fill="url(#paint17_linear_0_219)"/>
<path id="Vector_19" d="M18.1642 59.4575C18.6473 59.9367 19.3002 60.2056 19.9806 60.2056C20.6611 60.2056 21.314 59.9367 21.7971 59.4575L24.2916 56.963C24.7708 56.4799 25.0397 55.827 25.0397 55.1466C25.0397 54.4661 24.7708 53.8132 24.2916 53.3301C23.8085 52.851 23.1556 52.5821 22.4752 52.5821C21.7947 52.5821 21.1419 52.851 20.6588 53.3301L18.1642 55.8247C17.685 56.3078 17.4161 56.9607 17.4161 57.6411C17.4161 58.3216 17.685 58.9744 18.1642 59.4575Z" fill="url(#paint18_linear_0_219)"/>
<path id="Vector_20" d="M13.2135 47.0018L5.35294 39.1413L3.97434 40.5199L11.8349 48.3804L13.2135 47.0018Z" fill="url(#paint19_linear_0_219)"/>
<path id="Vector_21" d="M53.7055 6.47857C53.2848 6.05911 52.7201 5.81563 52.1263 5.79764C51.5324 5.77964 50.954 5.98848 50.5086 6.38169L27.6702 26.4592L33.7249 32.5139L53.8024 9.67547C54.1984 9.2314 54.409 8.65242 54.391 8.05772C54.373 7.46302 54.1277 6.89786 53.7055 6.47857Z" fill="url(#paint20_linear_0_219)"/>
<path id="Vector_22" d="M32.9983 27.21L26.9436 21.1553C26.7286 20.9389 26.473 20.7672 26.1914 20.65C25.9098 20.5328 25.6078 20.4725 25.3027 20.4725C24.9977 20.4725 24.6957 20.5328 24.4141 20.65C24.1325 20.7672 23.8769 20.9389 23.6619 21.1553L16.2994 28.5178C14.4177 30.311 13.2247 32.7075 12.9282 35.2898C12.6317 37.8721 13.2504 40.4766 14.6767 42.6496L12.497 47.6871L17.5224 45.4953C19.6953 46.9113 22.2949 47.523 24.8713 47.2244C27.4476 46.9259 29.8385 45.7359 31.63 43.8605L38.9925 36.498C39.2089 36.283 39.3806 36.0274 39.4978 35.7458C39.615 35.4642 39.6753 35.1621 39.6753 34.8571C39.6753 34.5521 39.615 34.2501 39.4978 33.9685C39.3806 33.6869 39.2089 33.4313 38.9925 33.2163L32.9983 27.21Z" fill="url(#paint21_linear_0_219)"/>
<path id="Vector_23" d="M0.750556 42.0435C0.27137 41.5604 0.0025086 40.9076 0.0025086 40.2271C0.0025086 39.5467 0.27137 38.8938 0.750556 38.4107L3.24511 35.9162C3.7282 35.437 4.38108 35.1681 5.06153 35.1681C5.74197 35.1681 6.39485 35.437 6.87795 35.9162C7.35713 36.3993 7.62603 37.0521 7.62603 37.7326C7.62603 38.413 7.35713 39.0659 6.87795 39.549L4.3834 42.0435C3.9003 42.5227 3.24742 42.7916 2.56698 42.7916C1.88653 42.7916 1.23365 42.5227 0.750556 42.0435Z" fill="url(#paint22_linear_0_219)"/>
<path id="Vector_24" d="M13.4294 58.622L1.58634 46.791L4.68637 45.4469L14.7615 55.5341L13.4294 58.622Z" fill="url(#paint23_linear_0_219)"/>
<path id="Vector_25" d="M25.1514 35.069C24.5421 34.4584 24.1999 33.6309 24.1999 32.7683C24.1999 31.9056 24.5421 31.0781 25.1514 30.4674L27.0526 28.5541C27.6648 27.9478 28.4917 27.6076 29.3534 27.6076C30.2151 27.6076 31.0419 27.9478 31.6542 28.5541C32.2635 29.1648 32.6057 29.9923 32.6057 30.855C32.6057 31.7176 32.2635 32.5451 31.6542 33.1557L29.7409 35.069C29.1307 35.6747 28.3059 36.0145 27.4461 36.0145C26.5864 36.0145 25.7616 35.6747 25.1514 35.069Z" fill="url(#paint24_linear_0_219)"/>
<path id="Vector_26" d="M28.179 32.7807L27.4282 32.0299C26.9209 31.5175 26.6363 30.8256 26.6363 30.1045C26.6363 29.3834 26.9209 28.6915 27.4282 28.1791C27.9406 27.6718 28.6326 27.3872 29.3536 27.3872C30.0747 27.3872 30.7666 27.6718 31.279 28.1791L32.0298 28.9299C32.5371 29.4423 32.8217 30.1342 32.8217 30.8553C32.8217 31.5764 32.5371 32.2683 32.0298 32.7807C31.5189 33.2909 30.8264 33.5775 30.1044 33.5775C29.3824 33.5775 28.6899 33.2909 28.179 32.7807Z" fill="url(#paint25_linear_0_219)"/>
<path id="Vector_27" d="M17.8976 42.3223C17.896 41.5564 18.0455 40.7977 18.3375 40.0896C18.6295 39.3815 19.0583 38.738 19.5993 38.1958C20.1404 37.6537 20.783 37.2235 21.4905 36.9301C22.198 36.6366 22.9564 36.4855 23.7223 36.4855C23.7223 38.0314 23.109 39.5142 22.017 40.6085C20.925 41.7027 19.4435 42.3191 17.8976 42.3223Z" fill="url(#paint26_linear_0_219)"/>
</g>
<defs>
<linearGradient id="paint0_linear_0_219" x1="32.1943" y1="15.0613" x2="37.6829" y2="20.5499" gradientUnits="userSpaceOnUse">
<stop stop-color="#F0F0F0"/>
<stop offset="0.26" stop-color="#E3E3E3"/>
<stop offset="0.73" stop-color="#C2C2C2"/>
<stop offset="1" stop-color="#ADADAD"/>
</linearGradient>
<linearGradient id="paint1_linear_0_219" x1="16.7932" y1="0.739124" x2="11.2821" y2="-4.77202" gradientUnits="userSpaceOnUse">
<stop stop-color="#F0F0F0"/>
<stop offset="0.26" stop-color="#E3E3E3"/>
<stop offset="0.73" stop-color="#C2C2C2"/>
<stop offset="1" stop-color="#ADADAD"/>
</linearGradient>
<linearGradient id="paint2_linear_0_219" x1="7.92801" y1="39.6364" x2="10.5739" y2="42.2823" gradientUnits="userSpaceOnUse">
<stop stop-color="#F0F0F0"/>
<stop offset="0.26" stop-color="#E3E3E3"/>
<stop offset="0.73" stop-color="#C2C2C2"/>
<stop offset="1" stop-color="#ADADAD"/>
</linearGradient>
<linearGradient id="paint3_linear_0_219" x1="-7.85781" y1="25.1122" x2="-10.5145" y2="22.4555" gradientUnits="userSpaceOnUse">
<stop stop-color="#F0F0F0"/>
<stop offset="0.26" stop-color="#E3E3E3"/>
<stop offset="0.73" stop-color="#C2C2C2"/>
<stop offset="1" stop-color="#ADADAD"/>
</linearGradient>
<linearGradient id="paint4_linear_0_219" x1="6.55364" y1="45.2706" x2="7.67535" y2="46.3923" gradientUnits="userSpaceOnUse">
<stop stop-color="#FF9100"/>
<stop offset="1" stop-color="#FF5500"/>
</linearGradient>
<linearGradient id="paint5_linear_0_219" x1="10.1991" y1="48.924" x2="11.3208" y2="50.0458" gradientUnits="userSpaceOnUse">
<stop stop-color="#FF9100"/>
<stop offset="1" stop-color="#FF5500"/>
</linearGradient>
<linearGradient id="paint6_linear_0_219" x1="13.8401" y1="52.5567" x2="14.9532" y2="53.6699" gradientUnits="userSpaceOnUse">
<stop stop-color="#FF9100"/>
<stop offset="1" stop-color="#FF5500"/>
</linearGradient>
<linearGradient id="paint7_linear_0_219" x1="32.4511" y1="12.5952" x2="38.8817" y2="19.0258" gradientUnits="userSpaceOnUse">
<stop stop-color="#707070"/>
<stop offset="1" stop-color="#8D8F94"/>
</linearGradient>
<linearGradient id="paint8_linear_0_219" x1="29.8395" y1="9.23007" x2="33.4872" y2="12.8778" gradientUnits="userSpaceOnUse">
<stop stop-color="#1A1A1A"/>
<stop offset="1" stop-color="#3B3C3D"/>
</linearGradient>
<linearGradient id="paint9_linear_0_219" x1="19.1735" y1="0.367769" x2="12.7252" y2="-6.08053" gradientUnits="userSpaceOnUse">
<stop stop-color="#707070"/>
<stop offset="1" stop-color="#8D8F94"/>
</linearGradient>
<linearGradient id="paint10_linear_0_219" x1="22.5527" y1="2.99051" x2="18.8986" y2="-0.663524" gradientUnits="userSpaceOnUse">
<stop stop-color="#1A1A1A"/>
<stop offset="1" stop-color="#3B3C3D"/>
</linearGradient>
<linearGradient id="paint11_linear_0_219" x1="38.5563" y1="1.79765" x2="47.4102" y2="10.6515" gradientUnits="userSpaceOnUse">
<stop stop-color="#FFCC00"/>
<stop offset="1" stop-color="#FF7300"/>
</linearGradient>
<linearGradient id="paint12_linear_0_219" x1="37.8542" y1="2.49979" x2="38.856" y2="3.50162" gradientUnits="userSpaceOnUse">
<stop stop-color="#1A1A1A"/>
<stop offset="1" stop-color="#3B3C3D"/>
</linearGradient>
<linearGradient id="paint13_linear_0_219" x1="29.986" y1="-5.79148" x2="21.0873" y2="-14.6901" gradientUnits="userSpaceOnUse">
<stop stop-color="#FFCC00"/>
<stop offset="1" stop-color="#FF7300"/>
</linearGradient>
<linearGradient id="paint14_linear_0_219" x1="29.2817" y1="-5.08624" x2="28.2758" y2="-6.09217" gradientUnits="userSpaceOnUse">
<stop stop-color="#1A1A1A"/>
<stop offset="1" stop-color="#3B3C3D"/>
</linearGradient>
<linearGradient id="paint15_linear_0_219" x1="18.2632" y1="41.9567" x2="10.6167" y2="34.3102" gradientUnits="userSpaceOnUse">
<stop stop-color="#707070"/>
<stop offset="1" stop-color="#8D8F94"/>
</linearGradient>
<linearGradient id="paint16_linear_0_219" x1="-10.3188" y1="14.6037" x2="-2.64106" y2="22.2815" gradientUnits="userSpaceOnUse">
<stop stop-color="#707070"/>
<stop offset="1" stop-color="#8D8F94"/>
</linearGradient>
<linearGradient id="paint17_linear_0_219" x1="20.3176" y1="55.4808" x2="12.4656" y2="47.6288" gradientUnits="userSpaceOnUse">
<stop stop-color="#707070"/>
<stop offset="1" stop-color="#8D8F94"/>
</linearGradient>
<linearGradient id="paint18_linear_0_219" x1="-6.18215" y1="30.2613" x2="-9.83619" y2="26.6073" gradientUnits="userSpaceOnUse">
<stop stop-color="#1A1A1A"/>
<stop offset="1" stop-color="#3B3C3D"/>
</linearGradient>
<linearGradient id="paint19_linear_0_219" x1="4.68505" y1="39.8434" x2="12.537" y2="47.6954" gradientUnits="userSpaceOnUse">
<stop stop-color="#707070"/>
<stop offset="1" stop-color="#8D8F94"/>
</linearGradient>
<linearGradient id="paint20_linear_0_219" x1="33.1315" y1="27.1495" x2="53.7782" y2="7.12039" gradientUnits="userSpaceOnUse">
<stop stop-color="#FFCC00"/>
<stop offset="1" stop-color="#FF7300"/>
</linearGradient>
<linearGradient id="paint21_linear_0_219" x1="16.033" y1="43.5578" x2="33.071" y2="27.428" gradientUnits="userSpaceOnUse">
<stop stop-color="#FFCC00"/>
<stop offset="1" stop-color="#FF7300"/>
</linearGradient>
<linearGradient id="paint22_linear_0_219" x1="2.01054" y1="37.161" x2="5.64969" y2="40.8002" gradientUnits="userSpaceOnUse">
<stop stop-color="#1A1A1A"/>
<stop offset="1" stop-color="#3B3C3D"/>
</linearGradient>
<linearGradient id="paint23_linear_0_219" x1="2.69577" y1="45.69" x2="14.5294" y2="57.5237" gradientUnits="userSpaceOnUse">
<stop stop-color="#FFCC00"/>
<stop offset="1" stop-color="#FF7300"/>
</linearGradient>
<linearGradient id="paint24_linear_0_219" x1="31.5948" y1="28.6246" x2="25.1728" y2="35.0466" gradientUnits="userSpaceOnUse">
<stop stop-color="#1A1A1A"/>
<stop offset="1" stop-color="#3B3C3D"/>
</linearGradient>
<linearGradient id="paint25_linear_0_219" x1="31.6208" y1="28.5992" x2="27.8275" y2="32.3925" gradientUnits="userSpaceOnUse">
<stop stop-color="#1A1A1A"/>
<stop offset="1" stop-color="#3B3C3D"/>
</linearGradient>
<linearGradient id="paint26_linear_0_219" x1="23.6617" y1="39.4039" x2="17.9097" y2="39.4039" gradientUnits="userSpaceOnUse">
<stop stop-color="#F0F0F0"/>
<stop offset="0.26" stop-color="#E3E3E3"/>
<stop offset="0.73" stop-color="#C2C2C2"/>
<stop offset="1" stop-color="#ADADAD"/>
</linearGradient>
<clipPath id="clip0_0_219">
<rect width="60.2204" height="60.2204" fill="white"/>
</clipPath>
</defs>
</svg>`;

const VEHICLE_PLANE_XML = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="53.96" height="24.7" viewBox="0 0 53.96 24.7" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="OBJECTS" clip-path="url(#clip0_0_247)">
<path id="Vector" d="M15.53 19.64L19.6 13.8" stroke="url(#paint0_linear_0_247)" stroke-miterlimit="10"/>
<path id="Vector_2" d="M15.53 5.06L19.6 10.9" stroke="url(#paint1_linear_0_247)" stroke-miterlimit="10"/>
<path id="Vector_3" d="M48.09 19.31L44.07 17.1" stroke="url(#paint2_linear_0_247)" stroke-miterlimit="10"/>
<path id="Vector_4" d="M48.09 5.4L44.07 7.61" stroke="url(#paint3_linear_0_247)" stroke-miterlimit="10"/>
<path id="Vector_5" d="M48.49 15.94V17.25H51.85V15.94H48.49Z" fill="url(#paint4_linear_0_247)"/>
<path id="Vector_6" d="M48.5 11.69V13H51.86V11.69H48.5Z" fill="url(#paint5_linear_0_247)"/>
<path id="Vector_7" d="M48.49 7.45002V8.76001H51.85V7.45002H48.49Z" fill="url(#paint6_linear_0_247)"/>
<path id="Vector_8" d="M14.37 21.21V13.71L17.55 14.08L15.88 17.97V21.21H14.37Z" fill="url(#paint7_linear_0_247)"/>
<path id="Vector_9" d="M19.11 22.58C19.11 23.1423 18.8867 23.6815 18.4891 24.0791C18.0915 24.4766 17.5522 24.7 16.99 24.7H14.07C13.7908 24.7013 13.514 24.6475 13.2556 24.5415C12.9973 24.4356 12.7624 24.2796 12.5645 24.0826C12.3665 23.8856 12.2095 23.6515 12.1023 23.3936C11.9952 23.1357 11.94 22.8592 11.94 22.58C11.94 22.0151 12.1644 21.4733 12.5639 21.0739C12.9633 20.6744 13.5051 20.45 14.07 20.45H16.99C17.2692 20.45 17.5458 20.5052 17.8036 20.6123C18.0615 20.7195 18.2956 20.8766 18.4926 21.0745C18.6896 21.2724 18.8456 21.5073 18.9515 21.7656C19.0575 22.024 19.1113 22.3008 19.11 22.58Z" fill="url(#paint8_linear_0_247)"/>
<path id="Vector_10" d="M14.37 3.49V11L17.55 10.62L15.88 6.73V3.49H14.37Z" fill="url(#paint9_linear_0_247)"/>
<path id="Vector_11" d="M19.11 2.12999C19.1113 1.85075 19.0575 1.57399 18.9515 1.31563C18.8456 1.05726 18.6896 0.822385 18.4926 0.624464C18.2956 0.426543 18.0615 0.269501 17.8036 0.162336C17.5458 0.0551717 17.2692 1.03213e-05 16.99 1.34279e-05H14.07C13.5051 1.34279e-05 12.9633 0.224401 12.5639 0.623854C12.1644 1.02331 11.94 1.56508 11.94 2.12999C11.94 2.6949 12.1644 3.2367 12.5639 3.63615C12.9633 4.0356 13.5051 4.25999 14.07 4.25999H16.99C17.5532 4.25735 18.0924 4.03178 18.4897 3.63261C18.887 3.23345 19.11 2.69317 19.11 2.12999Z" fill="url(#paint10_linear_0_247)"/>
<path id="Vector_12" d="M4 13.61V23.95H8.18V17.56L6.13 15.51V13.61H4Z" fill="url(#paint11_linear_0_247)"/>
<path id="Vector_13" d="M9.82999 23.96H4V22.79H8.66C8.97031 22.79 9.26789 22.9133 9.4873 23.1327C9.70672 23.3521 9.82999 23.6497 9.82999 23.96Z" fill="url(#paint12_linear_0_247)"/>
<path id="Vector_14" d="M4 11.09V0.75H8.18V7.14L6.13 9.19V11.09H4Z" fill="url(#paint13_linear_0_247)"/>
<path id="Vector_15" d="M9.82999 0.750013H4V1.92H8.66C8.97031 1.92 9.26789 1.79673 9.4873 1.57731C9.70672 1.3579 9.82999 1.06032 9.82999 0.750013Z" fill="url(#paint14_linear_0_247)"/>
<path id="Vector_16" d="M34.7 21.28H37.26C38.5326 21.2812 39.7928 21.0308 40.9684 20.5435C42.1439 20.0561 43.2116 19.3412 44.11 18.44L46.31 16.25H48.09V12.35H40.09L34.7 21.28Z" fill="url(#paint15_linear_0_247)"/>
<path id="Vector_17" d="M34.7 3.42H37.26C38.5326 3.41885 39.7928 3.66916 40.9684 4.15654C42.1439 4.64392 43.2116 5.35875 44.11 6.26L46.31 8.46001H48.09V12.35H40.09L34.7 3.42Z" fill="url(#paint16_linear_0_247)"/>
<path id="Vector_18" d="M48.89 12.35V3.17H47.28V12.35H48.89Z" fill="url(#paint17_linear_0_247)"/>
<path id="Vector_19" d="M51.68 2.18999C51.68 1.62507 51.4556 1.0833 51.0562 0.683851C50.6567 0.284399 50.1149 0.060011 49.55 0.060011H46.63C46.0651 0.060011 45.5233 0.284399 45.1239 0.683851C44.7244 1.0833 44.5 1.62507 44.5 2.18999C44.5026 2.75316 44.7282 3.29239 45.1274 3.68968C45.5265 4.08697 46.0668 4.31002 46.63 4.31001H49.55C50.1132 4.31002 50.6534 4.08697 51.0526 3.68968C51.4518 3.29239 51.6773 2.75316 51.68 2.18999Z" fill="url(#paint18_linear_0_247)"/>
<path id="Vector_20" d="M47.29 12.35V21.53H48.9V12.35H47.29Z" fill="url(#paint19_linear_0_247)"/>
<path id="Vector_21" d="M-1.2207e-06 12.35C0.00142634 12.841 0.189025 13.3133 0.524932 13.6715C0.860838 14.0296 1.32006 14.2471 1.81 14.28L26.87 15.89V8.81999L1.81 10.43C1.32093 10.4605 0.861762 10.6758 0.525634 11.0324C0.189506 11.3889 0.00158979 11.86 -1.2207e-06 12.35Z" fill="url(#paint20_linear_0_247)"/>
<path id="Vector_22" d="M24.18 12.35V19.35C24.18 19.6017 24.2297 19.8508 24.3264 20.0832C24.423 20.3156 24.5645 20.5266 24.7429 20.7041C24.9214 20.8816 25.1331 21.0221 25.366 21.1175C25.5989 21.2129 25.8483 21.2613 26.1 21.26H34.7C36.8359 21.3071 38.9213 20.6079 40.597 19.2826C42.2727 17.9574 43.4337 16.0893 43.88 14L48.09 12.33L43.88 10.67C43.5945 9.38988 43.05 8.18176 42.28 7.12001C41.3963 5.94943 40.2499 5.00287 38.9333 4.3567C37.6166 3.71053 36.1666 3.38284 34.7 3.40001H26.1C25.5908 3.40001 25.1024 3.60229 24.7424 3.96236C24.3823 4.32243 24.18 4.81078 24.18 5.31999V12.35Z" fill="url(#paint21_linear_0_247)"/>
<path id="Vector_23" d="M51.68 22.52C51.68 23.0849 51.4556 23.6267 51.0562 24.0261C50.6567 24.4256 50.1149 24.65 49.55 24.65H46.63C46.0651 24.65 45.5233 24.4256 45.1239 24.0261C44.7244 23.6267 44.5 23.0849 44.5 22.52C44.5026 21.9559 44.7279 21.4157 45.1268 21.0168C45.5257 20.6179 46.0659 20.3926 46.63 20.39H49.55C50.1141 20.3926 50.6543 20.6179 51.0532 21.0168C51.4521 21.4157 51.6774 21.9559 51.68 22.52Z" fill="url(#paint22_linear_0_247)"/>
<path id="Vector_24" d="M53.96 5.44V19.26L51.37 18.24V6.46L53.96 5.44Z" fill="url(#paint23_linear_0_247)"/>
<path id="Vector_25" d="M33.35 12.35C33.3553 12.7058 33.29 13.059 33.1578 13.3894C33.0256 13.7197 32.8292 14.0206 32.5799 14.2745C32.3307 14.5284 32.0335 14.7303 31.7057 14.8686C31.3778 15.0068 31.0258 15.0787 30.67 15.08H28.47C27.7583 15.0774 27.0767 14.7928 26.5743 14.2886C26.072 13.7844 25.79 13.1017 25.79 12.39C25.79 11.6792 26.0724 10.9975 26.5749 10.4949C27.0775 9.99235 27.7592 9.71 28.47 9.71H30.7C31.3987 9.71775 32.0667 9.99808 32.5618 10.4912C33.0568 10.9844 33.3396 11.6513 33.35 12.35Z" fill="url(#paint24_linear_0_247)"/>
<path id="Vector_26" d="M30.25 11.92V12.79C30.25 13.3867 30.013 13.959 29.591 14.381C29.169 14.803 28.5967 15.04 28 15.04C27.705 15.04 27.4129 14.9817 27.1405 14.8685C26.868 14.7553 26.6207 14.5894 26.4125 14.3804C26.2044 14.1713 26.0396 13.9232 25.9276 13.6503C25.8157 13.3774 25.7587 13.085 25.76 12.79V11.92C25.7587 11.625 25.8157 11.3326 25.9276 11.0597C26.0396 10.7868 26.2044 10.5387 26.4125 10.3296C26.6207 10.1205 26.868 9.95467 27.1405 9.84147C27.4129 9.72828 27.705 9.66999 28 9.67C28.5967 9.67 29.169 9.90707 29.591 10.329C30.013 10.751 30.25 11.3233 30.25 11.92Z" fill="url(#paint25_linear_0_247)"/>
<path id="Vector_27" d="M41.82 12.35C41.3741 12.7975 40.8442 13.1526 40.2607 13.3948C39.6773 13.6371 39.0518 13.7618 38.42 13.7618C37.7883 13.7618 37.1627 13.6371 36.5793 13.3948C35.9958 13.1526 35.4659 12.7975 35.02 12.35C35.4659 11.9025 35.9958 11.5475 36.5793 11.3052C37.1627 11.0629 37.7883 10.9382 38.42 10.9382C39.0518 10.9382 39.6773 11.0629 40.2607 11.3052C40.8442 11.5475 41.3741 11.9025 41.82 12.35Z" fill="url(#paint26_linear_0_247)"/>
</g>
<defs>
<linearGradient id="paint0_linear_0_247" x1="17.56" y1="19.93" x2="17.56" y2="13.51" gradientUnits="userSpaceOnUse">
<stop stop-color="#F0F0F0"/>
<stop offset="0.26" stop-color="#E3E3E3"/>
<stop offset="0.73" stop-color="#C2C2C2"/>
<stop offset="1" stop-color="#ADADAD"/>
</linearGradient>
<linearGradient id="paint1_linear_0_247" x1="17.56" y1="4.77" x2="17.56" y2="11.18" gradientUnits="userSpaceOnUse">
<stop stop-color="#F0F0F0"/>
<stop offset="0.26" stop-color="#E3E3E3"/>
<stop offset="0.73" stop-color="#C2C2C2"/>
<stop offset="1" stop-color="#ADADAD"/>
</linearGradient>
<linearGradient id="paint2_linear_0_247" x1="46.07" y1="19.74" x2="46.07" y2="16.66" gradientUnits="userSpaceOnUse">
<stop stop-color="#F0F0F0"/>
<stop offset="0.26" stop-color="#E3E3E3"/>
<stop offset="0.73" stop-color="#C2C2C2"/>
<stop offset="1" stop-color="#ADADAD"/>
</linearGradient>
<linearGradient id="paint3_linear_0_247" x1="46.07" y1="4.96" x2="46.07" y2="8.05" gradientUnits="userSpaceOnUse">
<stop stop-color="#F0F0F0"/>
<stop offset="0.26" stop-color="#E3E3E3"/>
<stop offset="0.73" stop-color="#C2C2C2"/>
<stop offset="1" stop-color="#ADADAD"/>
</linearGradient>
<linearGradient id="paint4_linear_0_247" x1="50.17" y1="17.25" x2="50.17" y2="15.94" gradientUnits="userSpaceOnUse">
<stop stop-color="#A61400"/>
<stop offset="1" stop-color="#520000"/>
</linearGradient>
<linearGradient id="paint5_linear_0_247" x1="50.18" y1="13" x2="50.18" y2="11.7" gradientUnits="userSpaceOnUse">
<stop stop-color="#A61400"/>
<stop offset="1" stop-color="#520000"/>
</linearGradient>
<linearGradient id="paint6_linear_0_247" x1="50.17" y1="8.76001" x2="50.17" y2="7.45002" gradientUnits="userSpaceOnUse">
<stop stop-color="#A61400"/>
<stop offset="1" stop-color="#520000"/>
</linearGradient>
<linearGradient id="paint7_linear_0_247" x1="15.96" y1="21.21" x2="15.96" y2="13.71" gradientUnits="userSpaceOnUse">
<stop stop-color="#707070"/>
<stop offset="1" stop-color="#8D8F94"/>
</linearGradient>
<linearGradient id="paint8_linear_0_247" x1="15.53" y1="24.7" x2="15.53" y2="20.45" gradientUnits="userSpaceOnUse">
<stop stop-color="#1A1A1A"/>
<stop offset="1" stop-color="#3B3C3D"/>
</linearGradient>
<linearGradient id="paint9_linear_0_247" x1="15.96" y1="3.49" x2="15.96" y2="10.99" gradientUnits="userSpaceOnUse">
<stop stop-color="#707070"/>
<stop offset="1" stop-color="#8D8F94"/>
</linearGradient>
<linearGradient id="paint10_linear_0_247" x1="15.53" y1="0.0100134" x2="15.53" y2="4.25999" gradientUnits="userSpaceOnUse">
<stop stop-color="#1A1A1A"/>
<stop offset="1" stop-color="#3B3C3D"/>
</linearGradient>
<linearGradient id="paint11_linear_0_247" x1="6.09" y1="23.95" x2="6.09" y2="13.61" gradientUnits="userSpaceOnUse">
<stop stop-color="#FF1E00"/>
<stop offset="1" stop-color="#C70000"/>
</linearGradient>
<linearGradient id="paint12_linear_0_247" x1="6.91999" y1="23.95" x2="6.91999" y2="22.79" gradientUnits="userSpaceOnUse">
<stop stop-color="#1A1A1A"/>
<stop offset="1" stop-color="#3B3C3D"/>
</linearGradient>
<linearGradient id="paint13_linear_0_247" x1="6.09" y1="0.75" x2="6.09" y2="11.09" gradientUnits="userSpaceOnUse">
<stop stop-color="#FF1E00"/>
<stop offset="1" stop-color="#C70000"/>
</linearGradient>
<linearGradient id="paint14_linear_0_247" x1="6.91999" y1="0.750013" x2="6.91999" y2="1.91" gradientUnits="userSpaceOnUse">
<stop stop-color="#1A1A1A"/>
<stop offset="1" stop-color="#3B3C3D"/>
</linearGradient>
<linearGradient id="paint15_linear_0_247" x1="41.4" y1="12.35" x2="41.4" y2="21.28" gradientUnits="userSpaceOnUse">
<stop stop-color="#707070"/>
<stop offset="1" stop-color="#8D8F94"/>
</linearGradient>
<linearGradient id="paint16_linear_0_247" x1="41.4" y1="12.36" x2="41.4" y2="3.43" gradientUnits="userSpaceOnUse">
<stop stop-color="#707070"/>
<stop offset="1" stop-color="#8D8F94"/>
</linearGradient>
<linearGradient id="paint17_linear_0_247" x1="48.08" y1="3.17" x2="48.08" y2="12.35" gradientUnits="userSpaceOnUse">
<stop stop-color="#707070"/>
<stop offset="1" stop-color="#8D8F94"/>
</linearGradient>
<linearGradient id="paint18_linear_0_247" x1="48.09" y1="0.060011" x2="48.09" y2="4.31001" gradientUnits="userSpaceOnUse">
<stop stop-color="#1A1A1A"/>
<stop offset="1" stop-color="#3B3C3D"/>
</linearGradient>
<linearGradient id="paint19_linear_0_247" x1="48.09" y1="21.53" x2="48.09" y2="12.35" gradientUnits="userSpaceOnUse">
<stop stop-color="#707070"/>
<stop offset="1" stop-color="#8D8F94"/>
</linearGradient>
<linearGradient id="paint20_linear_0_247" x1="13.44" y1="15.88" x2="13.44" y2="8.81999" gradientUnits="userSpaceOnUse">
<stop stop-color="#FF1E00"/>
<stop offset="1" stop-color="#C70000"/>
</linearGradient>
<linearGradient id="paint21_linear_0_247" x1="36.14" y1="21.28" x2="36.14" y2="3.42001" gradientUnits="userSpaceOnUse">
<stop stop-color="#FF1E00"/>
<stop offset="1" stop-color="#C70000"/>
</linearGradient>
<linearGradient id="paint22_linear_0_247" x1="48.09" y1="24.65" x2="48.09" y2="20.39" gradientUnits="userSpaceOnUse">
<stop stop-color="#1A1A1A"/>
<stop offset="1" stop-color="#3B3C3D"/>
</linearGradient>
<linearGradient id="paint23_linear_0_247" x1="52.66" y1="19.26" x2="52.66" y2="5.44" gradientUnits="userSpaceOnUse">
<stop stop-color="#FF1E00"/>
<stop offset="1" stop-color="#C70000"/>
</linearGradient>
<linearGradient id="paint24_linear_0_247" x1="25.83" y1="12.35" x2="33.33" y2="12.35" gradientUnits="userSpaceOnUse">
<stop stop-color="#1A1A1A"/>
<stop offset="1" stop-color="#3B3C3D"/>
</linearGradient>
<linearGradient id="paint25_linear_0_247" x1="25.8" y1="12.35" x2="30.23" y2="12.35" gradientUnits="userSpaceOnUse">
<stop stop-color="#1A1A1A"/>
<stop offset="1" stop-color="#3B3C3D"/>
</linearGradient>
<linearGradient id="paint26_linear_0_247" x1="36.7791" y1="10.6988" x2="40.1378" y2="14.0575" gradientUnits="userSpaceOnUse">
<stop stop-color="#A61400"/>
<stop offset="1" stop-color="#520000"/>
</linearGradient>
<clipPath id="clip0_0_247">
<rect width="53.96" height="24.7" fill="white"/>
</clipPath>
</defs>
</svg>`;

const VEHICLE_BOAT_XML = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="53.96" height="24.7" viewBox="0 0 53.96 24.7" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="OBJECTS" clip-path="url(#clip0_0_163)">
<path id="Vector" d="M15.53 19.64L19.6 13.8" stroke="url(#paint0_linear_0_163)" stroke-miterlimit="10"/>
<path id="Vector_2" d="M15.53 5.06L19.6 10.9" stroke="url(#paint1_linear_0_163)" stroke-miterlimit="10"/>
<path id="Vector_3" d="M48.09 19.31L44.07 17.1" stroke="url(#paint2_linear_0_163)" stroke-miterlimit="10"/>
<path id="Vector_4" d="M48.09 5.4L44.07 7.61" stroke="url(#paint3_linear_0_163)" stroke-miterlimit="10"/>
<path id="Vector_5" d="M48.49 15.94V17.25H51.85V15.94H48.49Z" fill="url(#paint4_linear_0_163)"/>
<path id="Vector_6" d="M48.5 11.7V13.01H51.86V11.7H48.5Z" fill="url(#paint5_linear_0_163)"/>
<path id="Vector_7" d="M48.49 7.45001V8.76001H51.85V7.45001H48.49Z" fill="url(#paint6_linear_0_163)"/>
<path id="Vector_8" d="M14.37 21.21V13.71L17.55 14.08L15.88 17.97V21.21H14.37Z" fill="url(#paint7_linear_0_163)"/>
<path id="Vector_9" d="M19.12 22.58C19.1174 23.1432 18.8918 23.6824 18.4926 24.0797C18.0934 24.477 17.5532 24.7 16.99 24.7H14.07C13.5068 24.7 12.9666 24.477 12.5674 24.0797C12.1683 23.6824 11.9426 23.1432 11.94 22.58C11.94 22.0151 12.1644 21.4733 12.5639 21.0739C12.9633 20.6744 13.5051 20.45 14.07 20.45H16.99C17.5549 20.45 18.0967 20.6744 18.4961 21.0739C18.8956 21.4733 19.12 22.0151 19.12 22.58Z" fill="url(#paint8_linear_0_163)"/>
<path id="Vector_10" d="M14.37 3.49V11L17.55 10.62L15.88 6.73V3.49H14.37Z" fill="url(#paint9_linear_0_163)"/>
<path id="Vector_11" d="M19.12 2.13001C19.12 1.5651 18.8956 1.02333 18.4961 0.623873C18.0967 0.224421 17.5549 2.44141e-06 16.99 2.44141e-06H14.07C13.5051 2.44141e-06 12.9633 0.224421 12.5639 0.623873C12.1644 1.02333 11.94 1.5651 11.94 2.13001C11.9426 2.69411 12.1679 3.23436 12.5667 3.63324C12.9656 4.03213 13.5059 4.25738 14.07 4.26001H16.99C17.5541 4.25738 18.0944 4.03213 18.4933 3.63324C18.8921 3.23436 19.1174 2.69411 19.12 2.13001Z" fill="url(#paint10_linear_0_163)"/>
<path id="Vector_12" d="M4 13.61V23.95H8.18V17.56L6.13 15.51V13.61H4Z" fill="url(#paint11_linear_0_163)"/>
<path id="Vector_13" d="M9.84 23.96H4.00998V22.79H8.68003C8.83321 22.79 8.98486 22.8203 9.12626 22.8792C9.26765 22.9382 9.39597 23.0245 9.50382 23.1333C9.61167 23.242 9.69691 23.3711 9.75461 23.513C9.81232 23.6549 9.84132 23.8068 9.84 23.96Z" fill="url(#paint12_linear_0_163)"/>
<path id="Vector_14" d="M4 11.09V0.75H8.18V7.14L6.13 9.19V11.09H4Z" fill="url(#paint13_linear_0_163)"/>
<path id="Vector_15" d="M9.84 0.750002H4.00998V1.91999H8.68003C8.98859 1.91735 9.28357 1.79293 9.50083 1.57379C9.71809 1.35466 9.84001 1.05858 9.84 0.750002Z" fill="url(#paint14_linear_0_163)"/>
<path id="Vector_16" d="M34.7 21.28H37.26C38.5339 21.2803 39.7955 21.0296 40.9725 20.5423C42.1496 20.055 43.2191 19.3407 44.12 18.44L46.31 16.25H48.09V12.35H40.09L34.7 21.28Z" fill="url(#paint15_linear_0_163)"/>
<path id="Vector_17" d="M34.7 3.41999H37.26C38.5339 3.41971 39.7955 3.6704 40.9725 4.15769C42.1496 4.64498 43.2191 5.35935 44.12 6.26001L46.31 8.45999H48.09V12.35H40.09L34.7 3.41999Z" fill="url(#paint16_linear_0_163)"/>
<path id="Vector_18" d="M48.89 12.35V3.16997H47.28V12.35H48.89Z" fill="url(#paint17_linear_0_163)"/>
<path id="Vector_19" d="M51.6801 2.19C51.6801 1.62509 51.4556 1.08332 51.0561 0.683871C50.6567 0.284418 50.115 0.06 49.55 0.06H46.63C46.3508 0.0599969 46.0743 0.115158 45.8164 0.222323C45.5585 0.329488 45.3244 0.48653 45.1274 0.684451C44.9304 0.882371 44.7745 1.11728 44.6685 1.37564C44.5626 1.63401 44.5087 1.91076 44.51 2.19C44.51 2.75226 44.7334 3.29148 45.131 3.68906C45.5286 4.08664 46.0677 4.31 46.63 4.31H49.55C49.8293 4.31132 50.106 4.25744 50.3644 4.15149C50.6227 4.04554 50.8576 3.88959 51.0555 3.6926C51.2535 3.49561 51.4105 3.26147 51.5177 3.0036C51.6249 2.74574 51.6801 2.46925 51.6801 2.19Z" fill="url(#paint18_linear_0_163)"/>
<path id="Vector_20" d="M47.29 12.35V21.53H48.9V12.35H47.29Z" fill="url(#paint19_linear_0_163)"/>
<path id="Vector_21" d="M-2.68555e-05 12.35C0.00140071 12.8411 0.18903 13.3133 0.524937 13.6715C0.860843 14.0296 1.32003 14.2471 1.80997 14.28L26.84 15.89V8.82001L1.84 10.43C1.34561 10.4531 0.878974 10.6652 0.536533 11.0225C0.194093 11.3799 0.0019993 11.8551 -2.68555e-05 12.35Z" fill="url(#paint20_linear_0_163)"/>
<path id="Vector_22" d="M24.19 12.35V19.35C24.1887 19.6012 24.2372 19.8502 24.3327 20.0825C24.4282 20.3148 24.5689 20.5259 24.7465 20.7035C24.9241 20.8812 25.1352 21.0218 25.3676 21.1173C25.5999 21.2128 25.8488 21.2613 26.1 21.26H34.7C36.8208 21.3006 38.8902 20.6056 40.5564 19.293C42.2226 17.9804 43.3829 16.1313 43.84 14.06L48.05 12.39L43.84 10.69C43.5578 9.41057 43.0167 8.20243 42.25 7.13999C41.3637 5.96981 40.2154 5.02374 38.8973 4.37769C37.5791 3.73165 36.1279 3.40362 34.66 3.41999H26.06C25.8083 3.41999 25.5592 3.46974 25.3268 3.56635C25.0944 3.66296 24.8834 3.80453 24.7059 3.98295C24.5284 4.16137 24.3879 4.37311 24.2925 4.60599C24.1971 4.83888 24.1487 5.08834 24.15 5.34L24.19 12.35Z" fill="url(#paint21_linear_0_163)"/>
<path id="Vector_23" d="M51.6801 22.52C51.6801 23.0849 51.4556 23.6267 51.0561 24.0261C50.6567 24.4256 50.115 24.65 49.55 24.65H46.63C46.3508 24.65 46.0743 24.5948 45.8164 24.4877C45.5585 24.3805 45.3244 24.2235 45.1274 24.0255C44.9304 23.8276 44.7745 23.5927 44.6685 23.3344C44.5626 23.076 44.5087 22.7992 44.51 22.52C44.51 21.9568 44.7331 21.4166 45.1304 21.0174C45.5277 20.6182 46.0668 20.3926 46.63 20.39H49.55C50.115 20.39 50.6567 20.6144 51.0561 21.0139C51.4556 21.4133 51.6801 21.9551 51.6801 22.52Z" fill="url(#paint22_linear_0_163)"/>
<path id="Vector_24" d="M53.96 5.44V19.26L51.37 18.24V6.46L53.96 5.44Z" fill="url(#paint23_linear_0_163)"/>
<path id="Vector_25" d="M33.36 12.35C33.3574 13.0626 33.0731 13.7453 32.5692 14.2492C32.0653 14.7531 31.3826 15.0374 30.67 15.04H28.44C27.7283 15.0374 27.0467 14.7528 26.5443 14.2486C26.042 13.7444 25.76 13.0617 25.76 12.35C25.76 11.6392 26.0424 10.9576 26.545 10.455C27.0476 9.95236 27.7292 9.66999 28.44 9.66999H30.67C31.3817 9.66998 32.0644 9.95204 32.5686 10.4543C33.0728 10.9567 33.3574 11.6383 33.36 12.35Z" fill="url(#paint24_linear_0_163)"/>
<path id="Vector_26" d="M30.25 11.92V12.79C30.25 13.3867 30.013 13.959 29.591 14.381C29.169 14.8029 28.5967 15.04 28 15.04C27.705 15.04 27.4129 14.9817 27.1405 14.8685C26.8681 14.7553 26.6207 14.5894 26.4125 14.3804C26.2044 14.1713 26.0396 13.9232 25.9277 13.6503C25.8157 13.3773 25.7587 13.085 25.76 12.79V11.92C25.7587 11.625 25.8157 11.3327 25.9277 11.0597C26.0396 10.7868 26.2044 10.5387 26.4125 10.3296C26.6207 10.1206 26.8681 9.95466 27.1405 9.84146C27.4129 9.72827 27.705 9.66998 28 9.66999C28.5967 9.66999 29.169 9.90706 29.591 10.329C30.013 10.751 30.25 11.3232 30.25 11.92Z" fill="url(#paint25_linear_0_163)"/>
<path id="Vector_27" d="M41.84 12.35C40.9363 13.2519 39.7117 13.7585 38.435 13.7585C37.1582 13.7585 35.9337 13.2519 35.03 12.35C35.9337 11.4481 37.1582 10.9415 38.435 10.9415C39.7117 10.9415 40.9363 11.4481 41.84 12.35Z" fill="url(#paint26_linear_0_163)"/>
</g>
<defs>
<linearGradient id="paint0_linear_0_163" x1="17.56" y1="19.93" x2="17.56" y2="13.52" gradientUnits="userSpaceOnUse">
<stop stop-color="#F0F0F0"/>
<stop offset="0.26" stop-color="#E3E3E3"/>
<stop offset="0.73" stop-color="#C2C2C2"/>
<stop offset="1" stop-color="#ADADAD"/>
</linearGradient>
<linearGradient id="paint1_linear_0_163" x1="17.56" y1="4.77" x2="17.56" y2="11.18" gradientUnits="userSpaceOnUse">
<stop stop-color="#F0F0F0"/>
<stop offset="0.26" stop-color="#E3E3E3"/>
<stop offset="0.73" stop-color="#C2C2C2"/>
<stop offset="1" stop-color="#ADADAD"/>
</linearGradient>
<linearGradient id="paint2_linear_0_163" x1="46.08" y1="19.75" x2="46.08" y2="16.66" gradientUnits="userSpaceOnUse">
<stop stop-color="#F0F0F0"/>
<stop offset="0.26" stop-color="#E3E3E3"/>
<stop offset="0.73" stop-color="#C2C2C2"/>
<stop offset="1" stop-color="#ADADAD"/>
</linearGradient>
<linearGradient id="paint3_linear_0_163" x1="46.08" y1="4.95" x2="46.08" y2="8.04" gradientUnits="userSpaceOnUse">
<stop stop-color="#F0F0F0"/>
<stop offset="0.26" stop-color="#E3E3E3"/>
<stop offset="0.73" stop-color="#C2C2C2"/>
<stop offset="1" stop-color="#ADADAD"/>
</linearGradient>
<linearGradient id="paint4_linear_0_163" x1="50.17" y1="17.25" x2="50.17" y2="15.95" gradientUnits="userSpaceOnUse">
<stop stop-color="#0025AB"/>
<stop offset="1" stop-color="#0075BF"/>
</linearGradient>
<linearGradient id="paint5_linear_0_163" x1="50.17" y1="13.01" x2="50.17" y2="11.7" gradientUnits="userSpaceOnUse">
<stop stop-color="#0025AB"/>
<stop offset="1" stop-color="#0075BF"/>
</linearGradient>
<linearGradient id="paint6_linear_0_163" x1="50.16" y1="8.76001" x2="50.16" y2="7.45001" gradientUnits="userSpaceOnUse">
<stop stop-color="#0025AB"/>
<stop offset="1" stop-color="#0075BF"/>
</linearGradient>
<linearGradient id="paint7_linear_0_163" x1="15.96" y1="21.21" x2="15.96" y2="13.71" gradientUnits="userSpaceOnUse">
<stop stop-color="#707070"/>
<stop offset="1" stop-color="#8D8F94"/>
</linearGradient>
<linearGradient id="paint8_linear_0_163" x1="15.53" y1="24.7" x2="15.53" y2="20.45" gradientUnits="userSpaceOnUse">
<stop stop-color="#1A1A1A"/>
<stop offset="1" stop-color="#3B3C3D"/>
</linearGradient>
<linearGradient id="paint9_linear_0_163" x1="15.96" y1="3.49" x2="15.96" y2="10.99" gradientUnits="userSpaceOnUse">
<stop stop-color="#707070"/>
<stop offset="1" stop-color="#8D8F94"/>
</linearGradient>
<linearGradient id="paint10_linear_0_163" x1="15.53" y1="2.44141e-06" x2="15.53" y2="4.25001" gradientUnits="userSpaceOnUse">
<stop stop-color="#1A1A1A"/>
<stop offset="1" stop-color="#3B3C3D"/>
</linearGradient>
<linearGradient id="paint11_linear_0_163" x1="6.09" y1="23.95" x2="6.09" y2="13.61" gradientUnits="userSpaceOnUse">
<stop stop-color="#005EFF"/>
<stop offset="1" stop-color="#24C5FF"/>
</linearGradient>
<linearGradient id="paint12_linear_0_163" x1="6.91999" y1="23.95" x2="6.91999" y2="22.79" gradientUnits="userSpaceOnUse">
<stop stop-color="#1A1A1A"/>
<stop offset="1" stop-color="#3B3C3D"/>
</linearGradient>
<linearGradient id="paint13_linear_0_163" x1="6.09" y1="0.75" x2="6.09" y2="11.1" gradientUnits="userSpaceOnUse">
<stop stop-color="#005EFF"/>
<stop offset="1" stop-color="#24C5FF"/>
</linearGradient>
<linearGradient id="paint14_linear_0_163" x1="6.91999" y1="0.750002" x2="6.91999" y2="1.91999" gradientUnits="userSpaceOnUse">
<stop stop-color="#1A1A1A"/>
<stop offset="1" stop-color="#3B3C3D"/>
</linearGradient>
<linearGradient id="paint15_linear_0_163" x1="41.39" y1="12.35" x2="41.39" y2="21.28" gradientUnits="userSpaceOnUse">
<stop stop-color="#707070"/>
<stop offset="1" stop-color="#8D8F94"/>
</linearGradient>
<linearGradient id="paint16_linear_0_163" x1="41.4" y1="12.36" x2="41.4" y2="3.42999" gradientUnits="userSpaceOnUse">
<stop stop-color="#707070"/>
<stop offset="1" stop-color="#8D8F94"/>
</linearGradient>
<linearGradient id="paint17_linear_0_163" x1="48.09" y1="3.17997" x2="48.09" y2="12.35" gradientUnits="userSpaceOnUse">
<stop stop-color="#707070"/>
<stop offset="1" stop-color="#8D8F94"/>
</linearGradient>
<linearGradient id="paint18_linear_0_163" x1="48.1" y1="0.06" x2="48.1" y2="4.31" gradientUnits="userSpaceOnUse">
<stop stop-color="#1A1A1A"/>
<stop offset="1" stop-color="#3B3C3D"/>
</linearGradient>
<linearGradient id="paint19_linear_0_163" x1="48.09" y1="21.53" x2="48.09" y2="12.35" gradientUnits="userSpaceOnUse">
<stop stop-color="#707070"/>
<stop offset="1" stop-color="#8D8F94"/>
</linearGradient>
<linearGradient id="paint20_linear_0_163" x1="25.34" y1="12.35" x2="1.36997" y2="12.35" gradientUnits="userSpaceOnUse">
<stop stop-color="#005EFF"/>
<stop offset="1" stop-color="#24C5FF"/>
</linearGradient>
<linearGradient id="paint21_linear_0_163" x1="45.55" y1="12.35" x2="24.22" y2="12.35" gradientUnits="userSpaceOnUse">
<stop stop-color="#005EFF"/>
<stop offset="1" stop-color="#24C5FF"/>
</linearGradient>
<linearGradient id="paint22_linear_0_163" x1="48.09" y1="24.65" x2="48.09" y2="20.39" gradientUnits="userSpaceOnUse">
<stop stop-color="#1A1A1A"/>
<stop offset="1" stop-color="#3B3C3D"/>
</linearGradient>
<linearGradient id="paint23_linear_0_163" x1="52.66" y1="19.26" x2="52.66" y2="5.44" gradientUnits="userSpaceOnUse">
<stop stop-color="#005EFF"/>
<stop offset="1" stop-color="#24C5FF"/>
</linearGradient>
<linearGradient id="paint24_linear_0_163" x1="25.83" y1="12.35" x2="33.33" y2="12.35" gradientUnits="userSpaceOnUse">
<stop stop-color="#1A1A1A"/>
<stop offset="1" stop-color="#3B3C3D"/>
</linearGradient>
<linearGradient id="paint25_linear_0_163" x1="25.8" y1="12.35" x2="30.23" y2="12.35" gradientUnits="userSpaceOnUse">
<stop stop-color="#1A1A1A"/>
<stop offset="1" stop-color="#3B3C3D"/>
</linearGradient>
<linearGradient id="paint26_linear_0_163" x1="36.7912" y1="10.6874" x2="40.15" y2="14.0461" gradientUnits="userSpaceOnUse">
<stop stop-color="#0025AB"/>
<stop offset="1" stop-color="#0075BF"/>
</linearGradient>
<clipPath id="clip0_0_163">
<rect width="53.96" height="24.7" fill="white"/>
</clipPath>
</defs>
</svg>`;

const BUSH_BIG_XML = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="55" height="52" viewBox="0 0 55 52" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Isolation_Mode" clip-path="url(#clip0_0_106)">
<path id="Vector" d="M37.9538 35.6518C47.3768 35.6518 55.0157 28.0016 55.0157 18.5647C55.0157 9.12777 47.3768 1.47763 37.9538 1.47763C28.5307 1.47763 20.8918 9.12777 20.8918 18.5647C20.8918 28.0016 28.5307 35.6518 37.9538 35.6518Z" fill="url(#paint0_linear_0_106)"/>
<path id="Vector_2" d="M30.1527 52.0003C39.5758 52.0003 47.2147 44.3502 47.2147 34.9132C47.2147 25.4763 39.5758 17.8262 30.1527 17.8262C20.7297 17.8262 13.0908 25.4763 13.0908 34.9132C13.0908 44.3502 20.7297 52.0003 30.1527 52.0003Z" fill="url(#paint1_linear_0_106)"/>
<path id="Vector_3" d="M17.0619 34.1741C26.485 34.1741 34.1239 26.524 34.1239 17.0871C34.1239 7.65014 26.485 0 17.0619 0C7.63889 0 0 7.65014 0 17.0871C0 26.524 7.63889 34.1741 17.0619 34.1741Z" fill="url(#paint2_linear_0_106)"/>
</g>
<defs>
<linearGradient id="paint0_linear_0_106" x1="25.8889" y1="6.49936" x2="50.0425" y2="30.6174" gradientUnits="userSpaceOnUse">
<stop stop-color="#588720"/>
<stop offset="1" stop-color="#79AD30"/>
</linearGradient>
<linearGradient id="paint1_linear_0_106" x1="18.0864" y1="22.8281" x2="42.2511" y2="46.9573" gradientUnits="userSpaceOnUse">
<stop stop-color="#79AD30"/>
<stop offset="1" stop-color="#588720"/>
</linearGradient>
<linearGradient id="paint2_linear_0_106" x1="5.00058" y1="5.0099" x2="29.1542" y2="29.128" gradientUnits="userSpaceOnUse">
<stop stop-color="#588720"/>
<stop offset="1" stop-color="#79AD30"/>
</linearGradient>
<clipPath id="clip0_0_106">
<rect width="55" height="52" fill="white"/>
</clipPath>
</defs>
</svg>`;

const BUSH_SMALL_XML = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="37" height="35" viewBox="0 0 37 35" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Isolation_Mode" clip-path="url(#clip0_0_199)">
<path id="Vector" d="M25.5327 23.996C31.8718 23.996 37.0107 18.8468 37.0107 12.495C37.0107 6.14327 31.8718 0.994141 25.5327 0.994141C19.1936 0.994141 14.0547 6.14327 14.0547 12.495C14.0547 18.8468 19.1936 23.996 25.5327 23.996Z" fill="url(#paint0_linear_0_199)"/>
<path id="Vector_2" d="M20.2845 35C26.6237 35 31.7626 29.8509 31.7626 23.4991C31.7626 17.1473 26.6237 11.9982 20.2845 11.9982C13.9454 11.9982 8.80651 17.1473 8.80651 23.4991C8.80651 29.8509 13.9454 35 20.2845 35Z" fill="url(#paint1_linear_0_199)"/>
<path id="Vector_3" d="M11.478 23.0018C17.8172 23.0018 22.956 17.8527 22.956 11.5009C22.956 5.14913 17.8172 0 11.478 0C5.13889 0 0 5.14913 0 11.5009C0 17.8527 5.13889 23.0018 11.478 23.0018Z" fill="url(#paint2_linear_0_199)"/>
</g>
<defs>
<linearGradient id="paint0_linear_0_199" x1="17.4163" y1="4.37415" x2="33.6736" y2="20.599" gradientUnits="userSpaceOnUse">
<stop stop-color="#588720"/>
<stop offset="1" stop-color="#79AD30"/>
</linearGradient>
<linearGradient id="paint1_linear_0_199" x1="12.1671" y1="15.3649" x2="28.4318" y2="31.5972" gradientUnits="userSpaceOnUse">
<stop stop-color="#79AD30"/>
<stop offset="1" stop-color="#588720"/>
</linearGradient>
<linearGradient id="paint2_linear_0_199" x1="3.36402" y1="3.37205" x2="19.6212" y2="19.5969" gradientUnits="userSpaceOnUse">
<stop stop-color="#588720"/>
<stop offset="1" stop-color="#79AD30"/>
</linearGradient>
<clipPath id="clip0_0_199">
<rect width="37" height="35" fill="white"/>
</clipPath>
</defs>
</svg>`;

const VEHICLES = [
  { xml: VEHICLE_CAR_XML, width: 60.22, height: 60.22 },
  { xml: VEHICLE_PLANE_XML, width: 53.96, height: 24.7 },
  { xml: VEHICLE_BOAT_XML, width: 53.96, height: 24.7 },
] as const;

const CLUSTER_WIDTH = 160;
const CLUSTER_HEIGHT = 95;

/** 1 cụm trang trí ven đường (2 khóm cây + 1 xe đồ chơi xoay chéo) — Figma
 * ghép NGUYÊN 1 cụm này lặp lại xen kẽ 2 bên đường, đổi xe theo hàng
 * (76:6366/76:6058 dùng xe đua, 76:6328 dùng thuyền, 76:6404 dùng máy bay).
 * `variant` chọn xe (0=xe đua, 1=máy bay, 2=thuyền), `flipX` lật ngang để
 * đổi bên trái/phải như Figma (chỉ lật trục X — xem "-scale-y-100 rotate-180"
 * trong code gốc: 2 phép quay đó cộng lại triệt tiêu trục Y, chỉ còn lật X).
 */
export function RoadDecorCluster({
  variant,
  flipX,
  style,
}: {
  variant: number;
  flipX?: boolean;
  style?: ViewStyle;
}) {
  const vehicle = VEHICLES[variant % VEHICLES.length];
  return (
    <View
      pointerEvents="none"
      style={[
        { width: CLUSTER_WIDTH, height: CLUSTER_HEIGHT },
        flipX && { transform: [{ scaleX: -1 }] },
        style,
      ]}
    >
      <View style={{ position: 'absolute', right: 0, top: 5 }}>
        <SvgXml xml={BUSH_BIG_XML} width={55} height={52} />
      </View>
      <View style={{ position: 'absolute', right: 45, top: 55 }}>
        <SvgXml xml={BUSH_SMALL_XML} width={37} height={35} />
      </View>
      <View style={{ position: 'absolute', left: 8, top: (CLUSTER_HEIGHT - vehicle.height) / 2, transform: [{ rotate: '-25deg' }] }}>
        <SvgXml xml={vehicle.xml} width={vehicle.width} height={vehicle.height} />
      </View>
    </View>
  );
}

export { CLUSTER_WIDTH, CLUSTER_HEIGHT };

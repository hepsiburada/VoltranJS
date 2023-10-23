const welcomeStyle = () => {
  return `<style>
          @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@200;300;400;500;600;700;900&display=swap");
          * {
            outline: none;
            box-sizing: border-box;
          }
          :root {
            --body-bg-color: #e5ecef;
            --theme-bg-color: #f6f6f6;
            --body-font: "Poppins", sans-serif;
            --body-color: #2f2f33;
            --active-color: #4e4e4e;
            --active-light-color: #f1f1f1;
            --header-bg-color: #fff;
            --border-color: #d8d8d8;
            --alert-bg-color: #e8f2ff;
            --subtitle-color: #83838e;
            --inactive-color: #f0f0f0;
            --button-color: #fff;
            --logo-color: #000000;
          }
          .dark-mode {
            --body-bg-color: #1d1d1d;
            --theme-bg-color: #13131a;
            --header-bg-color: #1c1c24;
            --body-color: #fff;
            --inactive-color: #292932;
            --active-light-color: #263d63;
            --border-color: #26262f;
            --logo-color: #ffffff;
          }

          html {
            box-sizing: border-box;
            -webkit-font-smoothing: antialiased;
          }

          body {
            background-color: var(--body-bg-color);
            font-family: var(--body-font);
            font-size: 15px;
            color: var(--body-color);
            margin:0;
            padding:0;
          }
          .dark-light {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .dark-light svg {
            margin-right: 8px;
            width: 22px;
            cursor: pointer;
            fill: transparent;
            transition: 0.5s;
          }
          .dark-mode .dark-light svg {
            fill: #ffce45;
            stroke: #ffce45;
          }

          .dark-mode .detail-button {
            background-color: var(--inactive-color);
            color: var(--subtitle-color);
          }

          .container {
            display: flex;
            flex-direction: column;
            height: 100vh;
            margin: 0 auto;
            overflow: hidden;
            background-color: var(--theme-bg-color);
          }

          .logo {
            display: flex;
            align-items: center;
            font-weight: 600;
            font-size: 20px;
            cursor: pointer;
            justify-content: center;
          }

          .logo svg {
            width: 100%;
            height: 40px;
            margin-right: 20px;
            fill: var(--logo-color);
          }

          .header {
            display: flex;
            align-items: center;
            transition: box-shadow 0.3s;
            flex-shrink: 0;
            padding: 0 40px;
            white-space: nowrap;
            background-color: var(--header-bg-color);
            height: 60px;
            width: 100%;
            font-size: 14px;
            justify-content: space-between;
          }
          .settings {
            display: flex;
            align-items: center;
            font-weight: 500;
            margin-left: 20px;
          }
          .settings svg {
            width: 20px;
            color: #94949f;
          }

          .wrapper {
            width: 100%;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            scroll-behavior: smooth;
            padding: 20px 40px;
            overflow: auto;
          }
          .main-container {
            flex-grow: 1;
          }

          .url-button {
            border: none;
            color: var(--button-color);
            background-color: var(--active-color);
            padding: 8px 10px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 600;
            margin-top: 8px;
          }

          @-webkit-keyframes slideY {
            0% {
              opacity: 0;
              transform: translateY(200px);
            }
          }

          @keyframes slideY {
            0% {
              opacity: 0;
              transform: translateY(200px);
            }
          }
          .group-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            -webkit-animation: slideY 0.6s both;
                    animation: slideY 0.6s both;
          }
          .group-title {
            font-size: 20px;
            font-weight: 700;
            > span {
              font-size: 14px;
            }
          }
          .link {
            color: inherit;
            text-decoration: inherit;
          }

          .cards {
            padding-top: 10px;
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            grid-column-gap: 25px;
            grid-row-gap: 25px;
            -webkit-animation: slideY 0.6s both;
            animation: slideY 0.6s both;
          }
          @media screen and (max-width: 1600px) {
            .cards {
              grid-template-columns: repeat(4, 1fr);
            }
          }
          @media screen and (max-width: 1500px) {
            .cards {
              grid-template-columns: repeat(3, 1fr);
            }
          }
          @media screen and (max-width: 1212px) {
            .cards {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          .card {
            padding: 16px 16px;
            background-color: var(--header-bg-color);
            border-radius: 8px;
            cursor: pointer;
            transition: 0.2s;
            text-decoration: none;
            position: relative;

          }
          .card:hover {
            transform: scale(1.02);
          }
          .card svg {
            width: 46px;
            padding: 10px;
            border-radius: 8px;
          }
          .card-title {
            font-weight: 600;
            font-size: 12px;
          }
          .card-subtitle {
            color: var(--subtitle-color);
            font-size: 10px;
            margin-top: 8px;
            line-height: 1.6em;
          }
          .card-header {
            display: flex;
            align-items: flex-start;
          }

          .ribbon-wrapper {
            width: 85px;
            height: 88px;
            overflow: hidden;
            position: absolute;
            top: 0;
            right: 0;
          }

          .ribbon {
            font-size: 10px;
            font-weight: bold;
            color: var(--header-bg-color);;
            text-align: center;
            -webkit-transform: rotate(45deg);
            -moz-transform:    rotate(45deg);
            -ms-transform:     rotate(45deg);
            -o-transform:      rotate(45deg);
            position: relative;
            padding: 0;
            left: 26px;
            top: 14px;
            width: 80px;
            -webkit-box-shadow: 0px 0px 3px rgba(0,0,0,0.3);
            -moz-box-shadow:    0px 0px 3px rgba(0,0,0,0.3);
            box-shadow:         0px 0px 3px rgba(0,0,0,0.3);
          }

          .color-live{
            background-color: #badc58;
          }
          .color-dev{
            background-color: #f0932b;
          }
          .color-page{
            background-color: #00abff;
          }
          .color-1{
            background-color: #9b59b6;
          }
          .color-2{
            background-color: #c0392b;
          }
          .color-3{
            background-color: #16a085;
          }

          .badge{
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f50;
            font-weight: 600;
            margin-top: 16px;
            font-size: 10px;
            padding: 5px 10px;
            color: white;
            border-radius: 5px;
          }
          .detail-button {
            background-color: var(--active-light-color);
            color: var(--active-color);
            font-size: 11px;
            font-weight: 500;
            padding: 6px 8px;
            border-radius: 4px;
            text-align: start;
            word-break: break-all;
          }
          .detail-button + .detail-button {
            margin-left: 4px;
          }

          .card-buttons {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            margin-top: 4px;
          }
          .card-buttons,
          .card-buttons {
            margin-right: 12px;
          }
          .header-shadow {
            box-shadow: 0 4px 20px rgba(88, 99, 148, 0.17);
            z-index: 1;
          }
          .group {
              &:not(:first-child){
                margin-top: 20px;
              }
          }
          @-webkit-keyframes slide {
            0% {
              opacity: 0;
              transform: translateX(300px);
            }
          }

          @keyframes slide {
            0% {
              opacity: 0;
              transform: translateX(300px);
            }
          }


          @media screen and (max-width: 730px) {
            .group {
              padding-left: 0;
            }
            .cards {
              grid-template-columns: repeat(2, 1fr);
            }
          }


          @media screen and (max-width: 620px) {
            .cards {
              grid-template-columns: repeat(1, 1fr);
            }
          }
          @media screen and (max-width: 590px) {
            .header-menu {
              display: none;
            }
          }
          @media screen and (max-width: 520px) {
            .group-content {
              flex-direction: column;
              align-items: flex-start;
            }
            .main-container {
            }
          }
          @media screen and (max-width: 380px) {

            .wrapper {
              padding: 20px;
            }

            .header {
              padding: 0 20px;
            }
          }
        </style>`;
};

export default welcomeStyle;

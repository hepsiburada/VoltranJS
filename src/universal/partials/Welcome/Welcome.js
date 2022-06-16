import PartialCards from './PartialCards';
import welcomeStyle from './welcomeStyle';

import voltranConfig from '../../../../voltran.config';

export default () => {
  return `
    <!doctype html>
      <head>
        <title>Welcome</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${welcomeStyle()}
      </head>
      <body>
        <div class="container">
            <div class="header">
              <div class="logo">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="transform: rotate(180deg);">
                  <path
                    xmlns="http://www.w3.org/2000/svg"
                    d="M512 503.5H381.7a48 48 0 01-45.3-32.1L265 268.1l-9-25.5 2.7-124.6L338.2 8.5l23.5 67.1L512 503.5z"
                    fill="#0473ff"
                    data-original="#28b446"
                  />
                  <path
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#0473ff"
                    data-original="#219b38"
                    d="M361.7 75.6L265 268.1l-9-25.5 2.7-124.6L338.2 8.5z"
                  />
                  <path
                    xmlns="http://www.w3.org/2000/svg"
                    d="M338.2 8.5l-82.2 234-80.4 228.9a48 48 0 01-45.3 32.1H0l173.8-495h164.4z"
                    fill="#0473ff"
                    data-original="#518ef8"
                  />
                </svg>
               ${voltranConfig.prefix} MikroFrontend Interface
              <div class="settings">
                <div class="dark-light">
                  <svg
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1.5"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                  </svg>
                </div>
              </div>
            </div>
            </div>
            <div class="wrapper">
              <div class="main-container">
                ${PartialCards}
              </div>
            </div>
        </div>
        <script>
        const toggleButton = document.querySelector(".dark-light");
        let theme = localStorage.getItem("voltran-welcome-theme");

        if(theme === 'dark-mode'){
           document.body.classList.toggle("dark-mode");
        }

        toggleButton.addEventListener("click", () => {
          document.body.classList.toggle("dark-mode");
          localStorage.setItem("voltran-welcome-theme", document.body.classList.value);
        });
        </script>
      </body>
    </html>
  `;
};

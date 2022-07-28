import { getUsers, getUserPhotoLink } from "./httpRequests.js";

const loading = document.querySelector(".loading-container");
const sortSelect = document.querySelector(".sort-container select");
const flipCardWrapAll = document.querySelector("#flip-card-wrap-all");

let usersData = [];
let usersPhoto = {};

const createFlipEvents = (divCard, frontDivBtn, backDivBtn) => {
  frontDivBtn.style.visibility = "visible";
  frontDivBtn.onclick = function () {
    divCard.classList.toggle("do-flip");
  };

  backDivBtn.style.visibility = "visible";
  backDivBtn.onclick = function () {
    divCard.classList.toggle("do-flip");
  };
};

const createFrontCard = (userObj, photoLink) => {
  const divCard = document.createElement("div");
  divCard.classList.add("flip-card-front");

  const divBtn = document.createElement("div");
  divBtn.classList.add("flip-card-btn-turn-to-back");

  const names = userObj.name.split(" ")

  divCard.innerHTML = `      
        <div class="user-img">
          <img src="${photoLink}" alt="${userObj.name}" />
          <!--<div>
            <span>${names[0][0] + names[1][0]}</span>
          </div> -->            
        </div>
        <div class="user-name">
          <h3>${userObj.name}</h3>          
          <span>"${userObj.username}"</span>                   
        </div>
        <div class="user-info">
          <div class="user-info_section">
            <img src="./images/mail.svg" />
            
            <output>${userObj.email}</output>
          </div>
          <div class="user-info_section">
            <img src="./images/phone.svg" />
            <output>${userObj.phone}</output>
          </div>
          <div class="user-info_section">
            <img src="./images/website.svg" />
            <output
              ><a href="http://${userObj.website}/" target="_blank"
                >${userObj.website}</a
              ></output
            >
          </div>
          <div class="user-info_section">
            <img src="./images/location.svg" />
            <output>${userObj.address?.city}</output>
          </div>
        </div>           
  `;

  divBtn.innerText = "More info";

  divCard.appendChild(divBtn);
  return { divCard, divBtn };
};

const createBackCard = (userObj) => {
  const divCard = document.createElement("div");
  divCard.classList.add("flip-card-back");

  const divBtn = document.createElement("div");
  divBtn.classList.add("flip-card-btn-turn-to-front");
  divCard.innerHTML = `
         <div class="user-more-info">
          <div class="user-more-info_section">
            <div>
              <img src="./images/location.svg" />
              &nbsp;Adress
            </div>
            <div class="user-more-info_section-details">
              City: <output>${userObj.address?.city}</output>
            </div>
            <div class="user-more-info_section-details">
              Street:<output>${userObj.address?.street}</output>
            </div>
            <div class="user-more-info_section-details">
              Suite:<output>${userObj.address?.suite}</output>
            </div>
            <div class="user-more-info_section-details">
              Zipcode:<output>${userObj.address?.zipcode}</output>
            </div>
          </div>
          <div class="user-more-info_section">
            <div>
              <img src="./images/company.svg" />
              &nbsp;Company
            </div>
            <div class="user-more-info_section-details">
              Name:<output>${userObj.company?.name}</output>
            </div>
            <div class="user-more-info_section-details">
              Catch phrase:<output
                >"${userObj.company?.catchPhrase}"</output
              >
            </div>
            <div class="user-more-info_section-details">
              Bs:<output>"${userObj.company?.bs}"</output>
            </div>
          </div>
        </div>
        
      `;

  divBtn.innerText = "Back";
  divCard.appendChild(divBtn);

  return { divCard, divBtn };
};

const createUserTemplate = (userObj, photoLink, parent) => {
  let { divCard: divCardFront, divBtn: frontDivBtn } = createFrontCard(
    userObj,
    photoLink
  );
  let { divCard: divCardBack, divBtn: backDivBtn } = createBackCard(userObj);
  parent.appendChild(divCardFront);
  parent.appendChild(divCardBack);
  createFlipEvents(parent, frontDivBtn, backDivBtn);
};

const sortHandler = (event) => {
  let direction = event.target.value;
  flipCardWrapAll.innerHTML = "";
  usersData
    .sort(
      (a, b) => direction * new Intl.Collator().compare(a["name"], b["name"])
    )
    .map((user) => {
      const divWrapper = document.createElement("div");
      const divCard = document.createElement("div");
      divWrapper.classList.add("flip-card-3D-wrapper");
      divCard.classList.add("flip-card");
      createUserTemplate(user, usersPhoto[user.id], divCard);
      divWrapper.appendChild(divCard);
      flipCardWrapAll.appendChild(divWrapper);
    });
};

const displayUsersHandler = () => {
  loading.style.display = "block";
  getUsers().then((usersArray) => {
    usersData = usersArray.slice();

    loading.style.display = "none";
    flipCardWrapAll.style.display = "flex";

    usersData.map((user) => {
      const divWrapper = document.createElement("div");
      const divCard = document.createElement("div");

      divWrapper.classList.add("flip-card-3D-wrapper");
      divCard.classList.add("flip-card");

      getUserPhotoLink(user.id).then((photoLink) => {
        usersPhoto[user.id.toString()] = photoLink;
        createUserTemplate(user, photoLink, divCard);
      });

      divWrapper.appendChild(divCard);
      flipCardWrapAll.appendChild(divWrapper);
    });
  });
};

sortSelect.addEventListener("change", sortHandler);

window.addEventListener("load", displayUsersHandler);

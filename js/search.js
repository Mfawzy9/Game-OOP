

import {ui} from './ui.js'

export class search{
    constructor(){

        this.gamesContainer = document.getElementById('gamesContainer')
        this.searchInput = document.getElementById('searchInput')

        this.allCardsArr = [];
    }

    async getSearchedGames(){
        const options2 = {
            method: 'GET',
            headers: {
              'x-rapidapi-key': 'c18bb8f188mshf6c3019420216d1p101a71jsnd661387b83fe',
              'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'
            }
        };

        const allGamesApi = await fetch(`https://free-to-play-games-database.p.rapidapi.com/api/games` , options2)
        const allGamesData = await allGamesApi.json();
        this.allCardsArr = allGamesData;

        this.gamesContainer.innerHTML = this.allCardsArr.filter((game) => {
              return game.title.toLowerCase().includes(this.searchInput.value.toLowerCase());
          }).map((game)=>{
            return `
          <div class="col">
              <div id="Card" class="card h-100 cards-bg-color p-1"  >
                <div class="card-body">
    
                  <figure class="position-relative">
                  <img class="card-img-top object-fit-cover h-100" src="${game.thumbnail}" />
                  <video muted="true" preload="none" loop class="object-fit-fill w-100 d-none h-100 position-absolute top-0 start-0 z-3">
                      <source src="${game.thumbnail.replace("thumbnail.jpg", "videoplayback.webm")}">
                  </video>
                  </figure>
  
                    <div class="card-title d-flex justify-content-center align-items-center ">
                      <h3 class="text-color small"> ${game.title} </h3>                
                    </div>
    
                    <p class="card-text small text-center cards-p-color">
                      ${game.short_description}
                    </p>
    
                </div>
  
                    <div class="d-flex gap-2 px-2 border-bottom border-white border-opacity-25 pb-2">
                      <span class="show-details d-inline-block w-50 btn btn-sm btn-outline-info p-1" role="button" gameid="${game.id}"><i class="fa-solid fa-eye"></i> Details</span>
                      <a class="game-link d-inline-block w-50 p-1 btn btn-sm btn-outline-success" role="button" target="_blank" href="${game.game_url}"><i class="fa-solid fa-arrow-up-right-from-square"></i> Play!</a>
                    </div>
    
                <footer class="card-footer small p-1 d-flex align-items-center">
                    <p class="small text-center cards-p-color m-0">
                      ${game.release_date}
                    </p>
  
                    <div class="ms-auto">
                      <span class="pe-1 small text-color border-end">${game.genre}</span>
                      <span class="p-0 small text-color ">${game.platform}</span>
                    </div>
  
                </footer>
              </div>
          </div>`
      }).join("");

      new ui().detailsEvent();

      new ui().startVideo();
      new ui().stopVideo();

    }

}
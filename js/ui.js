/// <reference types="../@types/jquery" />

import {detailsApi} from './details.js'


export class ui {
    constructor(){
      this.year = new Date().getFullYear();
      $('.site-footer').html(`
        <p class="text-color m-0">© Copyright ${this.year}. Designed by mFawzy. All rights reserved</p>`)

      //?navbar changing color
      this.homeNav = $('header nav')
      this.aboutSec = $('.about-section')

      window.addEventListener('scroll', () =>{
        if(window.scrollY > this.aboutSec.offset().top - this.homeNav.outerHeight(true)){
          this.homeNav.addClass('bg-black bg-opacity-75');
        }else {
          this.homeNav.removeClass('bg-black bg-opacity-75');
        }
      });

      this.allGamesRecived = [];

      //pagination btns
      this.nextBtn = document.getElementById('next');
      this.prevBtn = document.getElementById('prev');
      this.prevBtn.addEventListener('click' , ()=>{
        this.prevPage()
      } )
      this.nextBtn.addEventListener('click' , ()=>{
        this.nextPage()
      } )

      this.gamesContainer = document.getElementById('gamesContainer')

            //pagination vars
            this.itemsPerPage = 12;
            this.currentPage = 1;
            this.receivedData = [];
            this.indexOfLastPage;
            this.indexOfFirstPage;
            this.currentItems;
            this.searchValue ;
    }

// ! display games
    displayGames(gamesData , searchValue){

        this.receivedData = gamesData;
        this.searchValue = searchValue;
        this.indexOfLastPage = this.currentPage * this.itemsPerPage;
        this.indexOfFirstPage = this.indexOfLastPage - this.itemsPerPage;
        this.currentItems = this.receivedData.slice(this.indexOfFirstPage , this.indexOfLastPage);

        this.gamesContainer.innerHTML = this.currentItems.filter((game) => {
          if (searchValue == '') {
            return game;
          } else {
            return game.title.toLowerCase().includes(searchValue.toLowerCase());
          }
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

        this.startVideo();
        this.stopVideo();

        if(this.currentPage == 1){
          this.prevBtn.classList.add('disabled');
        }else{
          this.prevBtn.classList.remove('disabled');
        }

        if((this.currentPage + 1) * this.itemsPerPage < this.receivedData.length){
          this.nextBtn.classList.remove('disabled');
        } else {
          this.nextBtn.classList.add('disabled');
        }

        this.detailsEvent()
        
    }

    detailsEvent(){
      document.querySelectorAll('.show-details').forEach((card) => {
          card.addEventListener('click', (e) => {
              $('body').addClass('overflow-hidden')
              $('header, .home-section , .about-section , .contact-section , .main-section').addClass('opacity-0')
              let id = card.getAttribute('gameid')
              this.showDetailes(id)
          })
      })
  }

  async showDetailes(idGame) {
      const details = await new detailsApi().getDetails(idGame);
          $('.details-section').fadeIn(500)
      
  }

    //prev pagination btn
    prevPage(){
      if((this.currentPage - 1) * this.itemsPerPage){
        this.currentPage--;
        this.displayGames(this.receivedData,this.searchValue)
        this.prevBtn.classList.remove('disabled');
        if(this.currentPage == 1){
          this.prevBtn.classList.add('disabled');
        }
        
      }
    }

    //next pagination btn
    nextPage(){
      if((this.currentPage + 1) * this.itemsPerPage < this.receivedData.length){
        this.currentPage++;
        this.displayGames(this.receivedData,this.searchValue)
        
      }
    }

    startVideo() {
        document.querySelectorAll('.card').forEach((card)=>{
            card.addEventListener('mouseenter' ,(event)=>{
                const video = event.target.querySelector("video"); 
                video.classList.remove("d-none");
                video.muted = true;
                video.play();
            })
        })
    }

    stopVideo() {
        document.querySelectorAll('.card').forEach((card)=>{
            card.addEventListener('mouseleave' ,(event)=>{
                const video = event.target.querySelector("video"); 
                video.classList.add("d-none");
                video.muted = true;
                // video.pause();
                video.currentTime = 0;
            })
        })
    }

// ! display games details
    displayDetails(detailsData){
        document.querySelector('.details-section').style.cssText = `
        background-image: linear-gradient(45deg, rgb(0 0 0 / 80%), rgb(0 0 0 / 80%)), url(${detailsData.thumbnail.replace('thumbnail' , 'background')});
        background-size: cover;
        background-position: center center;
        `

        document.getElementById("gameDetails").innerHTML = `
                          <div class="row justify-content-center gap-5 align-items-center">

          <h3 class="text-white text-center fw-bold mb-5 fs-1">${detailsData.title}</h3>
          <div class="col-lg-4">
            <img class="w-100" src="${detailsData.thumbnail}" alt="" />
            <div class=" my-3 text-center">
              <a class="btn btn-outline-warning" href="${detailsData.game_url}" target="_blank"><i class="fa-solid fa-link"></i> Show Game</a>
            </div>
          </div>
          
          <div class="col-lg-6 ${detailsData.hasOwnProperty('minimum_system_requirements') ? detailsData.minimum_system_requirements.os :  'd-none'}">         
            <h6 class=" text-capitalize text-white mb-4 h1 about-title position-relative pb-2">Minimum Requirements</h6>
            <div class="row text-white">
              <div class="col-lg-6">
                <h6 class="h4 text-secondary">Operation System</h6>
                <p class="h6">${detailsData.hasOwnProperty('minimum_system_requirements') ? detailsData.minimum_system_requirements.os :  'Not Available'}</p>

                <hr>
                <h6 class="h4 text-secondary">Memory</h6>
                <p class="h6">${detailsData.hasOwnProperty('minimum_system_requirements') ? detailsData.minimum_system_requirements.memory : 'Not Available'}</p>
                <hr>
                <h6 class="h4 text-secondary">Storage</h6>
                <p class="h6">${detailsData.hasOwnProperty('minimum_system_requirements') ? detailsData.minimum_system_requirements.storage : 'Not Available'}</p>
                <hr>
              </div>
              <div class="col-lg-6">
                <h6 class="h4 text-secondary">Processor</h6>
                <p class="h6">${detailsData.hasOwnProperty('minimum_system_requirements') ? detailsData.minimum_system_requirements.processor : 'Not Available'}</p>
                <hr>
                <h6 class="h4 text-secondary">Graphics</h6>
                <p class="h6">${detailsData.hasOwnProperty('minimum_system_requirements') ? detailsData.minimum_system_requirements.graphics : 'Not Available'}</p>
                <hr>
              </div>
            </div>
          </div>

        </div>
        <br>
        <br>
        <div class="row">
          <div class="col-lg-6">
            <h3 class="text-white h1 about-title position-relative pb-2">Informations</h3>
            <div class="row text-white">
              <div class="col-lg-6">
                <h6 class="h4 text-secondary">Category</h6>
                <p class="h6">${detailsData.genre}</p>
                <hr>
                <h6 class="h4 text-secondary">Platform</h6>
                <p class="h6">${detailsData.platform}</p>
                <hr>
                <h6 class="h4 text-secondary">publisher</h6>
                <p class="h6">${detailsData.publisher}</p>
                <hr>
              </div>
              <div class="col-lg-6">
                <h6 class="h4 text-secondary">developer</h6>
                <p class="h6">${detailsData.developer}</p>
                <hr>
                <h6 class="h4 text-secondary">release date</h6>
                <p class="h6">${detailsData.release_date}</p>
                <hr>
              </div>
            </div>
          </div>
          <div class="col-lg-6 ${detailsData.screenshots.length < 2 ? 'd-none' : 'd-block'}">

            <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel">
              <div class="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="2" aria-label="Slide 3"></button>
              </div>
              <div class="carousel-inner">
                <div class="carousel-item active">
                  <img src="${detailsData.screenshots.length < 2 ? '' : detailsData.screenshots[0].image}" class="d-block w-100 text-white" alt="missing picture">
                </div>
                <div class="carousel-item">
                  <img src="${detailsData.screenshots.length < 2 ? '' : detailsData.screenshots[1].image}" class="d-block w-100 text-white" alt="missing picture">
                </div>
                <div class="carousel-item">
                  <img src="${detailsData.screenshots.length < 2 ? '' : detailsData.screenshots[2].image}" class="d-block w-100 text-white" alt="missing picture">
                </div>
              </div>
              <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
        <br>
        <br>
        <div class="row">
          <div class="col-12">
            <h3 class="text-white h1 about-title position-relative pb-2">About</h3>
            <p class="game-desc lead text-white">${detailsData.description}</p>
          </div>
        </div>`;
    }
}
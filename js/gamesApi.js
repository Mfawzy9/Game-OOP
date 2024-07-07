/// <reference types="../@types/jquery" />

import {ui} from "./ui.js"
import {detailsApi} from "./details.js"
import {search} from './search.js'

export class gamesApi{
    constructor(){
        this.ui = new ui();
        this.searchClass = new search();
        this.getGames('mmorpg');
        this.cardsArr = [];
        this.allGamesArr = [];
        this.searchInput = document.getElementById('searchInput')

        this.searchInput.addEventListener("input", () => {
            this.currentCategory = document.querySelector('.main-nav .nav-link.active').getAttribute('data-category')
            if(this.searchInput.value == ''){
                this.getGames(this.currentCategory);
            }else{
                this.searchClass.getSearchedGames();
            }
        });
        
        //main navbar action
        document.querySelectorAll('.home-nav .nav-link').forEach((link) => {
            link.addEventListener('click', (e) => {
                document.querySelector('.home-nav .nav-link.activee').classList.remove('activee')
                e.target.classList.add('activee')
            })
        })

        //scrolling spy
        this.homeNavLinks = document.querySelectorAll('.home-nav .nav-link');
        this.sections = document.querySelectorAll('.sec')
        this.currentSection = 'home';

        window.addEventListener('scroll',()=>{
            this.sections.forEach((sectionEl)=>{
                if(window.scrollY >= (sectionEl.offsetTop - 200) ){
                    this.currentSection = sectionEl.id
                }
            })
            this.homeNavLinks.forEach((navLink) => {
                if(navLink.href.includes(this.currentSection)){
                    document.querySelector('.home-nav .nav-link.activee').classList.remove('activee')
                    navLink.classList.add('activee')
                }
            })
        })

        // dom ready
        $(()=>{
            $('.loaderr').fadeOut(1200,()=>{
                $('.start-up').animate({top: '-200%'} , 1000,function(){
                    $('.home-section .container').css('cssText' , `
                            animation: fade-in 1s both;`)
                            setTimeout(function(){
                                $('body').css('overflowY' , 'auto')
                                $('.start-up').remove()
                            },1000)
                })
            })
        })

        // sections animation
        window.addEventListener('scroll' , ()=>{
            let ani = document.querySelectorAll('.ani');
            
           for(let i = 0 ; i < ani.length ; i++){
                let windowHeight = window.innerHeight;
                let aniTop = ani[i].getBoundingClientRect().top;
                let aniPoint = 150;

                if(aniTop < windowHeight - 200 ){
                    ani[i].classList.add('active')
                }else{
                    ani[i].classList.remove('active')
                }
            }
        }) 

        //! stop form default behavior
        document.querySelectorAll('form').forEach((a)=>{
            a.addEventListener('submit', (e)=>{
                e.preventDefault()
                $('input , textarea').val('')
            })
        })
        
        //games navbar action
        document.querySelectorAll('.main-section .nav-link').forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.searchInput.value = ''
                $('.contact-section').addClass('opacity-0')
                this.ui.currentPage = 1;
                document.querySelector('.main-section .nav-link.active').classList.remove('active')
                e.target.classList.add('active')
                this.getGames(e.target.getAttribute('data-category'))
            })
        })

        // ? slide to top //
        this.upMode = $('#mode , .up');
        $('.up').on('click' , () =>{scrollTo(0,0)})
        window.addEventListener("scroll", () => {
          if (window.scrollY > $('.home-section').offset().top +40) {
            this.upMode.addClass("up-opacity");
          } else  {
            this.upMode.removeClass("up-opacity");
          }
        });

        //! dark mode//////
        this.html = document.querySelector('html');

        if(localStorage.getItem('theme') == 'dark'){
            this.html.setAttribute('data-theme' , 'dark')
            $('.mode-icon').addClass('fa-sun text-white').removeClass('fa-moon text-black');
            $('#pagination').attr('data-bs-theme', 'dark')
            $('.search-container').attr('data-bs-theme', 'dark')
        }else{
            this.html.setAttribute('data-theme' , 'light')
            $('.mode-icon').addClass('fa-moon text-black').removeClass('fa-sun text-white');
            $('#pagination').attr('data-bs-theme', 'light')
            $('.search-container').attr('data-bs-theme', 'light')
        }

        $('#mode').on("click" , ()=>{
            if(this.html.getAttribute('data-theme') == 'dark'){
                this.html.setAttribute('data-theme' , 'light');
                $('.mode-icon').addClass('fa-moon text-black').removeClass('fa-sun text-white');
                $('#pagination').attr('data-bs-theme', 'light')
                $('.search-container').attr('data-bs-theme', 'light')

                localStorage.setItem("theme", "light");
            }else{
                this.html.setAttribute('data-theme' , 'dark');
                $('.mode-icon').addClass('fa-sun text-white').removeClass('fa-moon text-black');
                $('#pagination').attr('data-bs-theme', 'dark')
                $('.search-container').attr('data-bs-theme', 'dark')
                localStorage.setItem("theme", "dark");
            }
        })
    }

    async getGames(category){
        document.querySelector('.loading').classList.remove('d-none')
        $('#gamesContainer').fadeOut(0)
        
        //!games by category
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'c18bb8f188mshf6c3019420216d1p101a71jsnd661387b83fe',
                'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'
            }
        };
        const gamesApi = await fetch(`https://free-to-play-games-database.p.rapidapi.com/api/games?category=${category}` , options)
        const gamesData = await gamesApi.json();
        this.cardsArr = gamesData;


        this.ui.displayGames(this.cardsArr,this.searchInput.value)

        // this.detailsEvent();
        document.querySelector('.loading').classList.add('d-none')
        $('#gamesContainer').fadeIn(600 )
        $('.contact-section').removeClass('opacity-0')
    }

}




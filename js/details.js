/// <reference types="../@types/jquery" />

import {ui} from "./ui.js"

export class detailsApi{
    constructor(){
        this.detailsUi = new ui()

        $('.x').on('click' , () => {
                $('.details-section').fadeOut(300,function(){
                    $('body').removeClass('overflow-hidden')
                })
            $('header, .home-section , .about-section , .main-section , .contact-section , .main-section').removeClass('opacity-0')
        })
    }

    async getDetails(id){
        document.querySelector('.loading').classList.remove('d-none');

        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'c18bb8f188mshf6c3019420216d1p101a71jsnd661387b83fe',
                'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'
            }
        };

        const detailsApi = await fetch(`https://free-to-play-games-database.p.rapidapi.com/api/game?id=${id}` , options);
        const detailsData = await detailsApi.json()

        this.detailsUi.displayDetails(detailsData);

        document.querySelector('.loading').classList.add('d-none')
    }

}
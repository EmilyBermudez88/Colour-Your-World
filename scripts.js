
const app= {};

app.$form=$('form');
app.$answer1=$('.answer1');
app.$answer2=$('.answer2');
app.$answer3=$('.answer3');
app.$answer4=$('.answer4');
app.$allAnswers= $('.answer1,.answer2,.answer3,.answer4');

let selectedValue;
let hex;

///////// DISPLAYING RESULTS FROM THE AJAX CALL //////////

app.displayColor=function(item){
    
    // IF/ELSE statement depending on what selection user chooses (4 colors for quad or analogic-complement)
    if(selectedValue === 'quad'){
        const colorHtml4=
        `<div class="palette4"></div>
        <div class="paletteInfo4">
            <p>${item.colors[3].hex.value}</p>
            <h3>${item.colors[3].name.value}</h3>
        </div>`
        app.$answer4.append(colorHtml4).removeClass("hideAnswer");
    } else if (selectedValue === 'analogic-complement'){
        const colorHtml5 =
        `<div class="palette4"></div>
        <div class="paletteInfo4">
            <p>#${hex}</p>
            <h3>Your Selection</h3>
        </div>`
        app.$answer4.append(colorHtml5).removeClass("hideAnswer");
    } else if (selectedValue === 'analogic' || selectedValue === 'monochrome' || selectedValue === 'monochrome-dark' || selectedValue === 'triad') {
        app.$answer4.addClass("hideAnswer");
    } 

    // DISPLAYING HEX VALUE AND COLOR NAME
    const colorHtml =
        `<div class="palette1"></div>
        <div class="paletteInfo1">
            <p>${item.colors[0].hex.value}</p>
            <h3>${item.colors[0].name.value}</h3>
        </div>`
    app.$answer1.append(colorHtml);

    const colorHtml2 = 
        `<div class="palette2"></div>
        <div class="paletteInfo2">
            <p>${item.colors[1].hex.value}</p>
            <h3>${item.colors[1].name.value}</h3>
        </div>`
    app.$answer2.append(colorHtml2);

    const colorHtml3=
        `<div class="palette3"></div>
        <div class="paletteInfo3">
            <p>${item.colors[2].hex.value}</p>
            <h3>${item.colors[2].name.value}</h3>
        </div>`
    app.$answer3.append(colorHtml3);

    

    // DISPLAYING COLOUR IN THE LIVING ROOM IMAGE
    $('.colorResult1, .palette1').css('background', `${item.colors[0].hex.value}`);

    $('.colorResult2, .palette2').css('background', `${item.colors[1].hex.value}`);

    $('.colorResult3, .palette3').css('background', `${item.colors[2].hex.value}`);

    if(selectedValue === 'quad'){ 
        $('.palette4').css('background',`${item.colors[3].hex.value}`)
    } else if (selectedValue === 'analogic-complement'){
        $('.palette4').css('background',`#${hex}`)
    }
};
        // I chose to do a fourth colour for Analogic-Complement because the API wouldn't pull the user's selection to add to that colour scheme. That is why I also can't pull the name of the selected colour to display, as it never went through the API --> it was a last minute decision to add the fourth colour! Otherwise it would have pulled the three colours as normal (I'll take any suggestions if I should go back to just 3 colours! )

///////// GETTING SELECTED VALUE FROM DROP DOWN, AND THEN MAKING AJAX CALL/////////
app.getColor= function(hex){
    
    selectedValue = $('option:selected').val();

    // IF/ELSE STATEMENT TO CHANGE LENGTH OF AJAX CALL DEPENDING ON COLOR SCHEME SELECTION
    if(selectedValue=='quad'){
        $.ajax({
            url:`https://www.thecolorapi.com/scheme?hex=${hex}&count=4&mode=${selectedValue}`,
            method:'GET',
            dataType:'json'
        }).then(function(response){
                console.log(response);
                app.$allAnswers.empty();
            app.displayColor(response);
        })
    }else{
        $.ajax({
            url:`https://www.thecolorapi.com/scheme?hex=${hex}&count=3&mode=${selectedValue}`,
            method:'GET',
            dataType:'json'
        }).then(function(response){
                console.log(response);
                app.$allAnswers.empty();
            app.displayColor(response);
        }).catch(function(){
            app.$allAnswers.empty();
            app.displayErrorMessage();
        });
    }
};

app.displayErrorMessage= function(){
    const error= `<p>Something went wrong. Please try again</p>`
    $('.results').append(error);
}


//////GETTING THE HEX CODE FOR THE COLOUR CHOSEN VIA THE COLOUR PICKER/////////
app.getUserInput= function(){

    const color=$('#colorInputColor').val();
    $('#colorInputText').attr('placeholder', `${color}`)

    // TAKING OUT THE # IN THE VARIABLE 'COLOR' TO BE ABLE TO PASS INTO AJAX CALL
    hex= color.substring(1);
    
    app.getColor(hex);
}

//////// EVENT LISTENERS FOR SUBMITTING THE FORM /////////
app.init = function(){
    app.$form.on('submit', function(e){
        e.preventDefault();
        app.getUserInput();
    })
};

//////// INITIALIZING ///////////
$(document).ready(function(){
    app.init();
    console.log('initialized')
})
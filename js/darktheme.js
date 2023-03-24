const theme = document.createElement('i');   
const header = document.getElementsByClassName('wrapper')[0];
const body = document.getElementsByTagName('body')[0];
const navItems = document.getElementsByClassName('page-link');
const title = document.getElementsByClassName('site-title')[0];
const icons = document.getElementsByTagName('i');

const dark_bg_color = '#343536';
const light_bg_color = 'white';

theme.classList.add('far');
theme.classList.add('fa-moon');
theme.style.float = 'left';
theme.style.margin = '20px 0 0 20px';
theme.style.cursor = 'pointer';

header.appendChild(theme);

theme.addEventListener('click', function(){
    // light to dark
    if (theme.classList.contains('fa-moon')){
        theme.classList.remove('fa-moon');
        theme.classList.add('fa-lightbulb');
        body.style.backgroundColor = dark_bg_color;
        title.style.color = light_bg_color;
        for (let i = 0 ; i < navItems.length ; i++){
            navItems[i].style.color = light_bg_color;
        }
        for (let i = 0 ; i < icons.length ; i++){
            icons[i].style.color = light_bg_color;
        }
        
    }
    //dark to light
    else {
        theme.classList.remove('fa-lightbulb');
        theme.classList.add('fa-moon');
        body.style.backgroundColor = light_bg_color;
        title.style.color = dark_bg_color;
        
        for (let i = 0 ; i < navItems.length ; i++){
            navItems[i].style.color = dark_bg_color;
        }
        for (let i = 0 ; i < icons.length ; i++){
            icons[i].style.color = dark_bg_color;
        }
    }
});
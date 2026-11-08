// Slide menu : open/close by tap or click (mouse hover is handled in main.css)
'use strict';

const menu = document.getElementById('menu');
const menuButton = document.getElementById('menu_bar');


function setMenuOpen(isOpen) {
    menu.classList.toggle('open', isOpen);
    menuButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}


function onClickMenuButton(event) {
    event.stopPropagation();
    setMenuOpen(!menu.classList.contains('open'));
}


function onClickDocument(event) {
    if (menu.contains(event.target)) {
        return;
    }
    setMenuOpen(false);
}


function onKeyDown(event) {
    if (event.key === 'Escape') {
        setMenuOpen(false);
    }
}


if (menu && menuButton) {
    menuButton.setAttribute('aria-label', 'Menu');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.addEventListener('click', onClickMenuButton);
    document.addEventListener('click', onClickDocument);
    document.addEventListener('keydown', onKeyDown);
}



// Recent Updates archive : years in one row (Archive  2025  2024 ...), the selected year opens below
// Without JavaScript the archive stays as vertical folding sections (<details>)

function onClickYearTab(event) {
    const archive = event.currentTarget.closest('.news_archive');
    const yearIndex = Number(event.currentTarget.dataset.yearIndex);
    const yearSections = archive.querySelectorAll('.news_year');
    const yearTabs = archive.querySelectorAll('.news_tabs button');

    // STEP1 open the clicked year (or close it when it is already open), close the others
    const isOpen = !yearSections[yearIndex].open;
    for (let index = 0; index < yearSections.length; index++) {
        const isTarget = isOpen && index === yearIndex;
        yearSections[index].open = isTarget;
        yearTabs[index].classList.toggle('active', isTarget);
        yearTabs[index].setAttribute('aria-expanded', isTarget ? 'true' : 'false');
    }
}


function setupNewsArchive(archive) {
    // STEP1 tab row : the 'Archive' label + one button per year
    const tabs = document.createElement('div');
    tabs.className = 'news_tabs';
    const label = archive.querySelector('h2');
    if (label) {
        tabs.appendChild(label);
    }

    // STEP2 a button for each <details>, using its <summary> text (year)
    const yearSections = archive.querySelectorAll('.news_year');
    for (let index = 0; index < yearSections.length; index++) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = yearSections[index].querySelector('summary').textContent;
        button.dataset.yearIndex = String(index);
        button.setAttribute('aria-expanded', 'false');
        button.addEventListener('click', onClickYearTab);
        tabs.appendChild(button);
        yearSections[index].open = false;
    }

    // STEP3 put the row above the years and switch the style to the tab mode
    archive.insertBefore(tabs, archive.firstChild);
    archive.classList.add('tabbed');
}


const newsArchive = document.querySelector('.news_archive');
if (newsArchive) {
    setupNewsArchive(newsArchive);
}

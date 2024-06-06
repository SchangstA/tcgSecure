// carousel functionality
const initSlider = () => {
    const imageList = document.querySelector(".slider-wrapper .image-list");
    const slideButtons = document.querySelectorAll(".slider-wrapper .slide-button");
    const sliderScrollBar = document.querySelector(".container-block .slider-scrollbar");
    const scrollbarThumb = document.querySelector(".scrollbar-thumb");
    const maxScrollLeft = imageList.scrollWidth - imageList.clientWidth;

    scrollbarThumb.addEventListener("mousedown", (e) => {
        const startX = e.clientX;
        const thumbPosition = scrollbarThumb.offsetLeft;

        const handleMouseMove = (e) => {
            const deltaX = e.clientX - startX;
            const newThumbPosition = thumbPosition + deltaX;
            const maxThumbPosition = sliderScrollBar.getBoundingClientRect().width - scrollbarThumb.offsetWidth;

            const boundedPostition = Math.max(0, Math.min(maxThumbPosition, newThumbPosition));
            const scrollPosition = (boundedPostition / maxThumbPosition) * maxScrollLeft;

            scrollbarThumb.style.left = `${boundedPostition}px`;
            imageList.scrollLeft = scrollPosition;
        }

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp) 
        }

        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)
    })

    slideButtons.forEach(button => {
        button.addEventListener("click", () => {
            const direction = button.id === "prev-slide" ? -1.005 : 1.005;
            const scrollAmount = imageList.clientWidth * direction;
            imageList.scrollBy({ left: scrollAmount, behavior: "smooth" });
        })
    });

    const handleSlideButtons = () => {
        slideButtons[0].style.display = imageList.scrollLeft <= 0 ? "none" : "block";
        slideButtons[1].style.display = imageList.scrollLeft >= maxScrollLeft ? "none" : "block";
    }

    const updateScrollThumbPosition = () => {
        const scrollPosition = imageList.scrollLeft;
        const thumbPosition = (scrollPosition / maxScrollLeft) * (sliderScrollBar.clientWidth - scrollbarThumb.offsetWidth);
        scrollbarThumb.style.left = `${thumbPosition}px`;
    }

    imageList.addEventListener("scroll", () => {
        handleSlideButtons();
        updateScrollThumbPosition();
    })
}

window.addEventListener("load", initSlider);

// display every card in cards.json into the shop
document.addEventListener("DOMContentLoaded", function() {
    fetch('cards.json')
    .then(response => response.json())
    .then(data => {
        // loop through each card in the data
        data.forEach((card, index) => {
            // populate HTML elements with card data for each card
            let cardElement = createCardElement(card, index);
            document.getElementById('parent-element').appendChild(cardElement);
        });
    })
    .catch(error => console.error('Error fetching card data:', error));

    // function to create a new card element
    function createCardElement(card, index) {
        let cardDiv = document.createElement('div');
        cardDiv.className = 'child';

        // set unique IDs for each element within the card
        cardDiv.innerHTML = `
        <img class="image-item" id="card-image-${index}" src="${card.Img}" alt="">
        <div class="card-info" id="card-info-${index}">
            <h1 id="card-name-${index}">${card.Name}</h1>
            <span id="card-game-${index}">${card.Game}</span> <br>
            <span id="card-set-${index}">${card.Set}</span> <br>
            <span id="card-details-${index}">${card.Details}</span> <br>
            <span id="card-price-${index}" style="color: gray;">As low as: </span>
            <span id="card-price-value-${index}" style="color: royalblue;">$${card.Price.toFixed(2)}</span> <br>
            <button class="add-to-cart-button" id="add-to-cart-button-${index}">
                <svg class="add-to-cart-box box-1" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="2" fill="#ffffff"/></svg>
                <svg class="add-to-cart-box box-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="2" fill="#ffffff"/></svg>
                <svg class="cart-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                <svg class="tick" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path fill="#ffffff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.29 16.29L5.7 12.7c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0L10 14.17l6.88-6.88c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-7.59 7.59c-.38.39-1.02.39-1.41 0z"/></svg>
                <span class="add-to-cart">Add to cart</span>
                <span class="added-to-cart">Added to cart</span>
            </button>
        </div>
    `;
    
// dynamically created button element
const addToCartButton = cardDiv.querySelector(`#add-to-cart-button-${index}`);

// attach event listener to the button
addToCartButton.addEventListener('click', function() {
    // Store information about the clicked card in localStorage
    const cardInfo = {
        id: card.id, // Assuming index is the ID of the card
        // Add other relevant data if needed
    };
    localStorage.setItem('cartItem', JSON.stringify(cardInfo));

    addToCartButton.classList.add('added');
    setTimeout(function(){
        addToCartButton.classList.remove('added');
    }, 2000);
});
    return cardDiv;
    }
});

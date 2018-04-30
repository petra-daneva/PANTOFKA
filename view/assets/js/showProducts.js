
function filterProducts(pages, entries, category) {
    var request = new XMLHttpRequest();
    request.open("get", "handle_requests.php?target=product&action=getProducts&pages=" + pages + "&entries=" + entries + "&category=" + category);
    request.onreadystatechange = function (ev) {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;
            var products = JSON.parse(response);
            document.getElementById('visualisation').innerHTML = "";
            visualiseProducts(products);

    }
    loadPageLinks(entries, category);
}

request.send();
}

function visualiseProducts(products) {
    var modal = document.getElementById('product-modal');

    for (var i = 0; i < products.length; i++) {

        var product = products[i];
        var visualisation = document.getElementById("visualisation");
        var showProduct = document.createElement('div');
        showProduct.className = "shown_products";
        visualisation.appendChild(showProduct);
        var productName = document.createElement("div");
        productName.className = "product_name";
        var productImg = document.createElement("div");
        productImg.className = "product_img";
        var showProductInfoLink = document.createElement("a");
        showProductInfoLink.id = "show_product";
        var img = document.createElement("img");
        showProductInfoLink.appendChild(img);
        productImg.appendChild(showProductInfoLink);
        img.id = product.product_id;
        var productPrice = document.createElement("div");
        productPrice.className = "price";
        var productSizes = document.createElement("div");
        productSizes.classList = "product-type";
        var spanPrice = document.createElement("span");
        spanPrice.className = "price";
        var spanPriceOnSale = document.createElement("span");
        spanPriceOnSale.className = "line-trough";
        productPrice.appendChild(spanPrice);
        productPrice.appendChild(spanPriceOnSale);
        var divButtons = document.createElement("div");
        divButtons.className = "div-buttons";

        showProduct.appendChild(productName);
        showProduct.appendChild(productImg);
        showProduct.appendChild(productPrice);
        showProduct.appendChild(productSizes);
        showProduct.appendChild(divButtons);

        img.onclick = function() {
            fillModal(this.id);

            modal.style.display = "block";
            var span = document.getElementsByClassName("close")[0];



            span.onclick = function() {
                modal.style.display = "none";

            }


            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }


        }


        productName.innerHTML = product.product_name;
        img.src = product.product_image_url;
        var sizeText = document.createElement('h6');
        var selectSize = document.createElement("select");
        selectSize.id = 'sizes-for-product' + product.product_id;
        selectSize.className = "sizes";
        selectSize.style = "display: inline-block";
        var sizes = product.sizes;
        if (sizes.length === 0){
            sizeText.innerHTML = "Out of stock!"
        }
        else {
            sizeText.innerHTML = "Sizes: ";

        }
        productSizes.appendChild(sizeText);
        productSizes.appendChild(selectSize);


        for (var j = 0; j < sizes.length; j++) {
            var size = sizes[j];
            if (size.size_quantity > 0) {
                selectSize.options[selectSize.options.length] = new Option(size.size_number, size.size_number);
            }
        }


        if (product.promo_percentage > 0) {

            var newPrice = product.price_on_promotion;
            spanPriceOnSale.innerHTML = product.price;
            spanPrice.innerHTML = " Now: " + newPrice + " BGN Was: ";

        }
        else {
            spanPrice.innerHTML = " Price: " + product.price + " BGN ";
        }

        var addToCartButton = document.createElement("button");
        addToCartButton.id = 'add-to-cart-button';
        addToCartButton.setAttribute('onclick' , 'addToCart('+ product.product_id + ')');
        divButtons.appendChild(addToCartButton);
        addToCartButton.innerHTML = "Add to cart";

        var addToFavButton = document.createElement("button");
        addToFavButton.id = 'add-to-fav-button';
        addToFavButton.setAttribute('onclick' , 'addToFav('+ product.product_id + ')');
        divButtons.appendChild(addToFavButton);
        addToFavButton.innerHTML = "Add to favorites";

    }

}


function filter() {
    var categorySelect = document.getElementById("categories");
    var category = categorySelect.options[categorySelect.selectedIndex].value;

    filterProducts(1, 20, category);
}


function filterCategories() {
        var categorySelect = document.getElementById("parent-categories");
        var category = categorySelect.options[categorySelect.selectedIndex].value;
        getStyles(category);
        loadInputSizes(category);

}




function productInfoBox(product_id) {
    var productRequest = new XMLHttpRequest();
    productRequest.open("get", "handle_requests.php?target=product&action=getProductById&id=" + product_id);
    productRequest.onreadystatechange = function (ev) {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;
            var product = JSON.parse(response);



        }

    }
    productRequest.send();
}


function fillModal(product_id) {
    var productRequest = new XMLHttpRequest();
    productRequest.open("get", "handle_requests.php?target=product&action=getProductById&id=" + product_id);
    productRequest.onreadystatechange = function (ev) {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;
            var product = JSON.parse(response);

            var productName =  document.getElementById("product_name");
            productName.innerHTML = product.product_name;

            var img = document.getElementById("img");
            img.src = product.product_image_url;

            var productStyle = document.getElementById("product_style");
            productStyle.innerHTML = product.style;

            var productColor = document.getElementById("product_color");
            productColor.innerHTML = product.color;

            var material = document.getElementById("material");
            material.innerHTML = product.material;


            var info = document.getElementById("info");
            info.innerHTML = product.info;


            var productPrice = document.getElementById("prices");
            productPrice.innerHTML="";
            var productSizes = document.getElementById("sizes");
            productSizes.innerHTML="";


            var spanPrice = document.createElement("span");
            spanPrice.className = "price";

            var spanPriceOnSale = document.createElement("span");
            spanPriceOnSale.className = "line-trough";

            productPrice.appendChild(spanPrice);
            productPrice.appendChild(spanPriceOnSale);
            var divButtons = document.getElementById("buttons");
            divButtons.innerHTML="";




            var sizeText = document.createElement('h6');
            var selectSize = document.createElement("select");
            selectSize.id = 'sizes-for-product' + product.product_id;
            selectSize.style = "display: inline-block";

            productSizes.appendChild(sizeText);
            productSizes.appendChild(selectSize);

            var sizesOfProduct = product.sizes;
            if (sizesOfProduct.length === 0){
                sizeText.innerHTML = "Out of stock!"
            }
            else {
                sizeText.innerHTML = "Sizes: ";

            }

            for (var j = 0; j < sizesOfProduct.length; j++) {
                var sizeOfProduct = sizesOfProduct[j];
                if (sizeOfProduct.size_quantity > 0) {
                    selectSize.options[selectSize.options.length] =
                        new Option(sizeOfProduct.size_number, sizeOfProduct.size_number);
                }
            }



            if (product.promo_percentage > 0) {

                var newPrice = product.price_on_promotion;
                spanPriceOnSale.innerHTML = product.price;
                spanPrice.innerHTML = " Now: " + newPrice + " BGN Was: ";

            }
            else {
                spanPrice.innerHTML = " Price: " + product.price + " BGN ";
            }

            var addToCartButton = document.createElement("button");
            addToCartButton.id = 'add-to-cart-button';
            addToCartButton.setAttribute('onclick' , 'addToCart('+ product.product_id + ')');
            divButtons.appendChild(addToCartButton);
            addToCartButton.innerHTML = "Add to cart";

            var addToFavButton = document.createElement("button");
            addToFavButton.id = 'add-to-fav-button';
            addToFavButton.setAttribute('onclick' , 'addToFav('+ product.product_id + ')');
            divButtons.appendChild(addToFavButton);
            addToFavButton.innerHTML = "Add to favorites";


        }

    }
    productRequest.send();
}

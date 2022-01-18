$(document).ready(function () {

    window.accessToken = "";
    window.userId = "";

    window.gliderSvg = null;
    window.gHeight = "";
    window.gWidth = "";



    // hide fullscreen button if not in an iframe
    if (window.location == window.parent.location) {
        $('#bZoom').hide();
    }

    // set combobox values for size
    $.each(window.gliderSizes, function (index, value) {
        $('#size').append('<option value="' + value + '">' + value + "</option>");
    });

    // replace glider svg with inline SVG
    $('img#glider').each(function () {
        var $img = $(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = window.gliderName + '.svg';

        jQuery.get(imgURL, function (data) {
            // Get the SVG tag, ignore the rest
            var svg = $(data).find('svg');

            // Add replaced image's ID to the new SVG
            if (typeof imgID !== 'undefined') {
                svg = svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if (typeof imgClass !== 'undefined') {
                svg = svg.attr('class', imgClass + ' replaced-svg');
            }

            // Remove any invalid XML tags as per http://validator.w3.org
            svg = svg.removeAttr('xmlns:a');

            // store h/w for image
            window.gHeight = svg.attr("height");
            window.gWidth = svg.attr("width");

            // remove h/w for proper fullscreen
            svg = svg.removeAttr('height');
            svg = svg.removeAttr('width');
            svg = svg.removeAttr('inkscape:version');
            svg = svg.removeAttr('sodipodi:docname');

            // Replace image with new SVG
            $img.replaceWith(svg);

            window.gliderSvg = svg;

            // set colors from URL
            getUrlParameters()

        }, 'xml');

    });


    // click
    $(".box").click(function () {

        let color = $(this).data("color")
        let color_id = $(this).data("id")

        // get element classes
        let classList = $(this).attr("class").split(/\s+/);
        // filter and get class other than "box"
        classList = classList.filter(function (item) {
            return item !== "box"
        })

        // svg element color update
        $('[id^=color' + classList[0] + ']').css('fill', color);
        // remove active class from all other row items
        $("." + classList[0]).removeClass("active");
        // update the url
        var newUrl = updateQueryStringParameter(window.location.href, classList[0], color_id);
        window.history.pushState("", "", newUrl);

        var url_string = window.location.href;
        $("#share_fb").attr("href", "http://www.facebook.com/sharer/sharer.php?u=" + url_string)

        $(this).addClass("active");
    })


    // hover
    $(".box").on("mouseover", function () {
        let color = $(this).data("color");
        // get element classes
        let classList = $(this).attr("class").split(/\s+/);
        // filter and get class other than "box"
        classList = classList.filter(function (item) {
            return item !== "box"
        })
        // svg element color update
        $('[id^=color' + classList[0] + ']').css('fill', color);

    }).on("mouseout", function () {
        getUrlParameters()
    })


    function getUrlParameters() {
        var url_string = window.location.href;
        $("#share_fb").attr("href", "http://www.facebook.com/sharer/sharer.php?u=" + url_string)
        if (url_string.includes("?")) {
            let paramString = url_string.split('?')[1];
            let categories = paramString.split('&')

            for (let category of categories) {
                let clicked = category.split("=").join('');
                $("#" + clicked).click();
            }
        }

    }

    $(".box").each(function () {
        $(this).css("background-color", $(this).data("color"))
    })

    function updateQueryStringParameter(uri, key, value) {
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        }
        else {
            return uri + separator + key + "=" + value;
        }
    }

});



function SVGPNG(cb) {
    svg = document.getElementById("glider").outerHTML;
    let temp = document.createElement("img");
    let imageSrc = URL.createObjectURL(
        new Blob([svg], { type: "image/svg+xml" })
    );

    temp.src = imageSrc;
    temp.setAttribute("style", "position:fixed;left:-200vw;");
    document.body.appendChild(temp);
    temp.onload = function onload() {
        let canvas = document.createElement("canvas");
        canvas.width = temp.clientWidth;
        canvas.height = temp.clientHeight + 40;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(temp, 0, 40);
        ctx.font = "25px sans-serif";
        ctx.fillText("Time: " + new Date().toLocaleString(), 10, 35);

        ctx.font = "25px sans-serif";
        ctx.fillText("Code: " + getRndInteger(11111, 99999), 10, 80);

        let src = canvas.toDataURL("image/png");
        cb(src, canvas);
        temp.remove();
        URL.revokeObjectURL(imageSrc);
    };
}


function onPNG() {
    SVGPNG((src) => {
        var a = document.createElement("a"); //Create <a>
        a.href = src;
        a.download = "Design.png"; //File name Here
        a.click(); //Downloaded file
    });
}


function onPDF() {
    SVGPNG((src) => {
        window.jsPDF = window.jspdf.jsPDF;
        var doc = new jsPDF();
        doc.addImage(src, 'JPEG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());
        doc.save("Design.pdf");
    });
}


function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

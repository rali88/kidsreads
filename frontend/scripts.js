$(document).ready(function() {
    let currentPage = 1;
    let totalPages = 0; // This will be fetched from the API

    function loadPage(page) {
        $.ajax({
            url: `/api/getPage/${page}`,
            method: 'GET',
            success: function(data) {
                let pageContent = `<p>${data.content}</p>`;
                if (data.image_url) {
                    pageContent += `<img src="${data.image_url}" alt="Page Image">`;
                }
                $('#page-display').html(pageContent);
                currentPage = page;
                updateControls();
            },
            error: function() {
                alert('Error loading page');
            }
        });
    }

    function updateControls() {
        $('#page-selector').val(currentPage);
        $('#prev-page').prop('disabled', currentPage === 1);
        $('#next-page').prop('disabled', currentPage === totalPages);
    }

    function populatePageSelector() {
        for (let i = 1; i <= totalPages; i++) {
            $('#page-selector').append(`<option value="${i}">Page ${i}</option>`);
        }
    }

    function fetchTotalPages() {
        $.ajax({
            url: `/api/getTotalPages`,
            method: 'GET',
            success: function(data) {
                totalPages = data.totalPages;
                populatePageSelector();
                loadPage(currentPage);
            },
            error: function() {
                alert('Error fetching total pages');
            }
        });
    }

    $('#prev-page').click(function() {
        if (currentPage > 1) {
            loadPage(currentPage - 1);
        }
    });

    $('#next-page').click(function() {
        if (currentPage < totalPages) {
            loadPage(currentPage + 1);
        }
    });

    $('#page-selector').change(function() {
        const selectedPage = parseInt($(this).val());
        loadPage(selectedPage);
    });

    fetchTotalPages();
});

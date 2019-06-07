$(document).ready(function(){

    var resetValueInputAndSelect = () => {
        $('input').val('');
        $('select').prop('selectedIndex', 0)
    }
    var pageUsers = () => {
        var item = $('#active_menu_item').text();
        var lines = '';
        if (item == 'Все пользователи'){

            $.ajax({
                type: 'POST',
                url: '/api/finddata/allpeople'
            }).done(function(data){
                if(data.ok){

                    for (var i=0; i < data.data.length; i++){
                        var arrFio = data.data[i].fio.split(' ');
                        var f = arrFio[0] || '';
                        var ii = arrFio[1] || '';
                        var o = arrFio[2] || '';
                        var inicial = f.charAt(0).toUpperCase()+ii.charAt(0).toUpperCase()+o.charAt(0).toUpperCase()+data.data[i].numberFio;
                        lines += `
                        <tr>
                            <td>${+i+1}</td>
                            <td>${inicial}</td>
                            <td>${data.data[i].fio}</td>
                            <td>${data.data[i].telephone}</td>
                            <td>${data.data[i].typePeople}</td>
                            <td>${data.data[i].status}</td>
                            <td></td>
                        </tr>`
                    }

                    var code = `
                        <table id="table_data">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Инициалы</th>
                                    <th>Фамилия И. О.</th>
                                    <th>Телефон</th>
                                    <th>Тип сметчика</th>
                                    <th>Статус</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                ${lines}                                 
                            </tbody>
                        </table>
                        `
                    $('.body_content').html(code);
                } else {
                    
                }
            });

        } else {
            var code = `<div class="body_row">
                            <input type="text" class="body_input" placeholder="Фамилия Имя Отчество" id="fio">
                            <select class="body_select" id="numberFio">
                                <option value="none">Номер</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                            </select>
                            <input type="text " class="body_input" placeholder="Инициалы" readonly id="inicial">
                        </div>
                        <div class="body_row">
                            <input type="text" class="body_input" placeholder="Номер телефона" id="telephone">
                            <input type="text" class="body_input" placeholder="Дата рождения" id="birthday">
                        </div>
                        <div class="body_row">
                            <input type="text" class="body_input" placeholder="Логин для входа в систему" id="login_sm">
                            <input type="text" class="body_input" placeholder="Пароль для входа в систему" id="password_sm">
                        </div>
                        <div class="body_row">
                            <select class="body_select" id="typePeople" style="margin-right: 30px;">
                                <option value="none">Тип сметчика</option>
                                <option value="Замерщик">Замерщик</option>
                                <option value="Дизайнер">Дизайнер</option>
                                <option value="Прораб">Прораб</option>
                            </select>
                            <button class="body_button" id="create_user">Создать пользователя</button>
                        </div>
                        <div class="body_row">
                            <span class="status_body" style="opacity: 0">Статус сохранения</span>
                        </div>`
            $('.body_content').html(code);
        }
    }
    var pageDocuments = () => {
        var item = $('#active_menu_item').text();
        if (item == 'Все сметы'){
            $('.body_content').html('<h1>Раздел в разработке ...</h1>');
        } else {
            $('.body_content').html('<h1>Раздел в разработке ...</h1>');
        }
    }
    // Написать универсальную функцию заполнения таблиц
    var getItemsJobs = () => {
        $.ajax({
            type: 'POST',
            url: '/api/finddata/findItemsJobs'
        }).done(data => {
            if(data.ok){
                let datas = data.data;
                $('.table_data tbody').html('');
                for (let i=0; i < datas.length; i++) {
                    if (datas[i].Status) {
                        var symbol = 'trueSymbol';
                    } else {
                        var symbol = 'falseSymbol';
                    }
                    $('.table_data tbody').append(`
                        <tr>
                            <td hidden>${datas[i].id}</td>
                            <td>${Number(i)+1}</td>
                            <td>${datas[i].Name}</td>
                            <td>${datas[i].UnitMe}</td>
                            <td>${datas[i].Price}</td>
                            <td><div class="${symbol}"></div></td>
                            <td class="editLine"><img src="/images/pencil.png"></td>
                            <td class="removeLine"><img src="/images/remove.png"></td>
                        </tr>
                    `);
                    
                }
                $('.body_content').show();
            } else {
                $('.body_content').show();
                console.log(data.err);
                alert(data.text);
            }
        });
    }
    var getAllRooms = () => {
        $.ajax({
            type: 'POST',
            url: '/api/finddata/findAllRooms'
        }).done(data => {
            if(data.ok){
                let datas = data.data;
                $('.table_data tbody').html('');
                for (let i=0; i < datas.length; i++) {
                    if (datas[i].Status) {
                        var symbol = 'trueSymbol';
                    } else {
                        var symbol = 'falseSymbol';
                    }
                    $('.table_data tbody').append(`
                        <tr>
                            <td hidden>${datas[i].id}</td>
                            <td>${Number(i)+1}</td>
                            <td>${datas[i].Name}</td>
                            <td><div class="${symbol}"></div></td>
                            <td class="editLine"><img src="/images/pencil.png"></td>
                            <td class="removeLine"><img src="/images/remove.png"></td>
                        </tr>
                    `);
                    $('.body_content').show();
                }
            } else {
                $('.body_content').show();
                console.log(data.err);
                alert(data.text);
            }
        });
    }
    var getAllTypeJobs = () => {
        $.ajax({
            type: 'POST',
            url: '/api/finddata/findAllTypeJobs'
        }).done(data => {
            if(data.ok){
                let datas = data.data;
                $('.table_data tbody').html('');
                for (let i=0; i < datas.length; i++) {
                    if (datas[i].Status) {
                        var symbol = 'trueSymbol';
                    } else {
                        var symbol = 'falseSymbol';
                    }
                    $('.table_data tbody').append(`
                        <tr>
                            <td hidden>${datas[i].id}</td>
                            <td>${Number(i)+1}</td>
                            <td>${datas[i].Name}</td>
                            <td><div class="${symbol}"></div></td>
                            <td class="editLine"><img src="/images/pencil.png"></td>
                            <td class="removeLine"><img src="/images/remove.png"></td>
                        </tr>
                    `);
                    $('.body_content').show();
                }
            } else {
                $('.body_content').show();
                console.log(data.err);
                alert(data.text);
            }
        });
    }
    var getAllObjectsJob = () => {
        $.ajax({
            type: 'POST',
            url: '/api/finddata/findAllObjectsJob'
        }).done(data => {
            if(data.ok){
                let datas = data.data;
                $('.table_data tbody').html('');
                for (let i=0; i < datas.length; i++) {
                    if (datas[i].Status) {
                        var symbol = 'trueSymbol';
                    } else {
                        var symbol = 'falseSymbol';
                    }
                    $('.table_data tbody').append(`
                        <tr>
                            <td hidden>${datas[i].id}</td>
                            <td>${Number(i)+1}</td>
                            <td>${datas[i].Name}</td>
                            <td><div class="${symbol}"></div></td>
                            <td class="editLine"><img src="/images/pencil.png"></td>
                            <td class="removeLine"><img src="/images/remove.png"></td>
                        </tr>
                    `);
                    $('.body_content').show();
                }
            } else {
                $('.body_content').show();
                console.log(data.err);
                alert(data.text);
            }
        });
    }
    var getArchitecture = () => {
        $('.table_data tbody').append(`
            <tr>
                <td hidden>ID</td>
                <td>1</td>
                <td>Демонтаж плинтуса</td>
                <td>
                    <select>
                        <option value="0">Комната</option>
                        <option value="1">Ванная</option>
                        <option value="2">Туалет</option>
                    </select>
                </td>
                <td>
                    <select>
                        <option value="0">Демонтажные работы</option>
                        <option value="1">Черновые отделочные работы</option>
                        <option value="2">Чистовые отделочные работы</option>
                    </select>
                </td>
                <td>
                    <select>
                        <option value="0">Полы</option>
                        <option value="1">Электрика</option>
                        <option value="2">Потолки</option>
                    </select>
                </td>
            </tr>
        `);
    }
    var SelectQueryActiveItemMenu = () => {
        let text = $('#active_menu_item').text();

        if (text == 'Комнаты') {
            getAllRooms();
        } else if (text == 'Тип работ') {
            getAllTypeJobs();
        } else if (text == 'Объект работ') {
            getAllObjectsJob();
        } else if (text == 'Наименование работ') {
            getItemsJobs();
        }
    }
    var pagePrices = () => {
        var item = $('#active_menu_item').text();
        if (item == 'Архитектура сметы'){
            $('.body_content').removeClass('body_content_row');
            $('.body_content').html(`
                <div class="body_content_row">
                    <table class="table_data table_align_left">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th class="size_40">Наименование работ</th>
                                <th class="size_10">Комната</th>
                                <th class="size_20">Тип работ</th>
                                <th class="size_10">Объект работ</th>
                                <th class="size_20">Формула р-та</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            `);
            getArchitecture();
        } else if (item == 'Комнаты') {
            $('.body_content').removeClass('body_content_row');
            $('.body_content').html(`
                <div class="body_content_row">
                    <div class="body_content_column">
                        <table class="table_data table_align_left">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Название комнаты</th>
                                    <th>Статус</th>
                                    <th class="size_10"></th>
                                    <th class="size_10"></th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                    <div class="body_content_column column_auto">
                        <button id="create_new_Room" class="create_new">Новая комната</button>
                    </div>
                </div>
            `);
        } else if (item == 'Тип работ') {
            $('.body_content').removeClass('body_content_row');
            $('.body_content').html(`
                <div class="body_content_row">
                    <div class="body_content_column">
                        <table class="table_data table_align_left">
                            <thead>
                                <tr>
                                <th>#</th>
                                <th>Тип работ</th>
                                <th>Статус</th>
                                <th class="size_10"></th>
                                <th class="size_10"></th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                    <div class="body_content_column column_auto">
                        <button id="create_new_Type" class="create_new">Новый тип работ</button>
                    </div>
                </div>
            `);
        } else if (item == 'Объект работ') {
            $('.body_content').removeClass('body_content_row');
            $('.body_content').html(`
                <div class="body_content_row">
                    <div class="body_content_column">
                        <table class="table_data table_align_left">
                            <thead>
                                <tr>
                                <th>#</th>
                                <th>Объект работ</th>
                                <th>Статус</th>
                                <th class="size_10"></th>
                                <th class="size_10"></th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                    <div class="body_content_column column_auto">
                        <button id="create_new_Object" class="create_new">Новый объект работ</button>
                    </div>
                </div>
            `);
        } else if (item == 'Наименование работ') {
            $('.body_content').removeClass('body_content_row');
            $('.body_content').hide();
            $('.body_content').html(`
                <div class="body_content_row">
                    <div class="body_content_column">
                        <table class="table_data table_align_left">
                            <thead>
                                <tr>
                                <th>#</th>
                                <th>Наименование работы</th>
                                <th>Ед. изм.</th>
                                <th>Цена</th>
                                <th>Статус</th>
                                <th class="size_10"></th>
                                <th class="size_10"></th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                    <div class="body_content_column column_auto">
                        <button id="create_new_Job" class="create_new">Создать</button>
                        <label for="upload_file_node" id="upload_foto" class="upload_excel_file">
                            <input type="file" id="upload_file_node" id="file" name="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
                            Загрузить файл
                        </label>
                    </div>
                </div>
            `);
        } else {
            $('.body_content').html('<h1>Неизвестный раздел</h1>');
        }
        SelectQueryActiveItemMenu();
    }
    var CreateOrEditNewElement = (type) => {

        let classButton = 'createRecord';
        if (type == 'Edit') {
            classButton = 'editRecord';
            var id = JSON.parse(sessionStorage.getItem('RowInfo')).id;
        }

        let itemMenu = $('#active_menu_item').text();
        
        $('body').css('overflow', 'hidden');
        if (itemMenu == 'Комнаты') {
            $('.modal_body').html(`
                <div class="room_row">
                    <input type="text" class="room_input" id="nameRoom" placeholder="Название комнаты">
                    <button class="room_modal ${classButton}" id="ButRoom">Сохранить</button>
                </div>
            `);
            let title = 'Новая комната';
            if (type == 'Edit') {
                title = 'Редактирование комнаты';
                $.ajax({
                    type: 'POST',
                    data: JSON.stringify({id}),
                    contentType: 'application/json',
                    url: '/api/finddata/findRoomById'
                }).done(async function(data){
                    if(data.ok){
                        console.log(data);
                        $('#nameRoom').val(`${data.data.Name}`);
                    } else {
                        alert(data.text);
                        console.log(data.error);
                    }
                });
            }
            $('.title_left').text(`${title}`);
        } else if (itemMenu == 'Тип работ') {
            $('.modal_body').html(`
                <div class="room_row">
                    <input type="text" class="room_input" id="TypeJob" placeholder="Тип работ">
                    <button class="room_modal ${classButton}" id="ButType">Сохранить</button>
                </div>
            `);
            let title = 'Новый тип работ';
            if (type == 'Edit') {
                title = 'Редактирование типа работ';
                $.ajax({
                    type: 'POST',
                    data: JSON.stringify({id}),
                    contentType: 'application/json',
                    url: '/api/finddata/findTypeJobById'
                }).done(async function(data){
                    if(data.ok){
                        console.log(data);
                        $('#TypeJob').val(`${data.data.Name}`);
                    } else {
                        alert(data.text);
                        console.log(data.error);
                    }
                });
            }
            $('.title_left').text(`${title}`);
        } else if (itemMenu == 'Объект работ') {
            $('.modal_body').html(`
                <div class="room_row">
                    <input type="text" class="room_input" id="Object" placeholder="Объект работ">
                    <button class="room_modal ${classButton}" id="ButObject">Сохранить</button>
                </div>
            `);
            let title = 'Новый объект работ';
            if (type == 'Edit') {
                title = 'Редактирование объекта работ';
                $.ajax({
                    type: 'POST',
                    data: JSON.stringify({id}),
                    contentType: 'application/json',
                    url: '/api/finddata/findObjectById'
                }).done(async function(data){
                    if(data.ok){
                        console.log(data);
                        $('#Object').val(`${data.data.Name}`);
                    } else {
                        alert(data.text);
                        console.log(data.error);
                    }
                });
            }
            $('.title_left').text(`${title}`);
        } else if (itemMenu == 'Наименование работ') {
            $('.modal_body').html(`
                <div class="room_row">
                    <input type="text" class="room_input" id="NameJob" placeholder="Введите наименование работы">
                </div>
                <div class="room_row">
                    <select class="room_input" id="UnitMe">
                        <option value="0">Единица измерения</option>
                        <option value="м/п">м/п</option>
                        <option value="м2">м2</option>
                        <option value="кг">кг</option>
                    </select>
                    <input type="text" class="room_input" id="Price" placeholder="Цена">
                </div>
                <div class="room_row">
                    <button class="room_modal ${classButton}" id="ButJob">Сохранить</button>
                </div>
            `);
            let title = 'Новое наименование работ';
            if (type == 'Edit') {
                title = 'Редактирование наименования работ';
                $.ajax({
                    type: 'POST',
                    data: JSON.stringify({id}),
                    contentType: 'application/json',
                    url: '/api/finddata/findNameJobById'
                }).done(async function(data){
                    if(data.ok){
                        console.log(data);
                        $('#NameJob').val(`${data.data.Name}`);
                        $('#Price').val(`${data.data.Price}`);
                        $(`.room_input option[value="${data.data.UnitMe}"]`).attr('selected', 'true');
                    } else {
                        alert(data.text);
                        console.log(data.error);
                    }
                });
            }
            $('.title_left').text(`${title}`);
        }
        $('.background_modal').show();
        $('input:eq(0)').focus();
    };
    var RequestError = (data) => {
        console.log(data);
        if ('fields' in data) {
            for (let i=0; i < data.fields.length; i++) {
                $(`#${data.fields[i]}`).addClass('error');
            }
            $('p.error').remove();
            $($('.modal_body .room_row')[$('.modal_body .room_row').length-1]).after(`<p class="error">${data.text}</p>`)
        } else {
            alert(data.text);
            console.log(data.err);
        }
    }
    var RemoveRecord = () => {
        let itemMenu = $('#active_menu_item').text();
        var id = JSON.parse(sessionStorage.getItem('RowInfo')).id;
        let data = {
            Id: id,
            Type: itemMenu
        }

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/api/removedata/removeRecordAdmin'
        }).done(async function(data){
            if(data.ok){
                console.log(data);
                SelectQueryActiveItemMenu();
            } else {
                RequestError(data);
            }
        });

    }

    // Функция обновления суммы подкатегории
    var refreshSummSubCategory = (category, subcategory, summ) => {

        var room = $('#activeRoom p:eq(0)').text();

        var type_job = $('.tj_text');
        for (var i=0; i < type_job.length; i++){
            if ($(type_job[i]).attr('title') == category) {
                var ul_job = type_job[i].parentElement.parentElement.children[1];
            }
        }
        var ul_li = ul_job.children;

        for (var i=0; i < ul_li.length; i++){

            if (ul_li[i].children[0].textContent == subcategory) {
                ul_li[i].children[1].textContent = summ + ' ₽';
            }
        }

    }
    // ГЕНЕРИРОВАНИЕ СВОДНОЙ => => => 
    var Сonsolidated = () => {
        var smeta = JSON.parse(sessionStorage.getItem('SMETA'));

        $('.ul_room').html('');

        var activeRoom = $('#activeRoom p:eq(0)').text();
        var activeCategory = $('.title_rcb h3').text().split(' → ')[0];

        var summAll = 0;

        Object.keys(smeta).map(rm => {
            var li_category = '';
            Object.keys(smeta[rm]).map(category => {
                var summ = 0;
                //var subcatText = '<ul>';
                Object.keys(smeta[rm][category]).map(subcat => {
                    var arr = smeta[rm][category][subcat];
                    summ += arr[arr.length-1]["Сумма"];
                    summAll += arr[arr.length-1]["Сумма"];
                    /*subcatText += `<li>
                        <div class="li_left">${subcat}</div>
                        <div class="li_right">${Math.ceil(arr[arr.length-1]["Сумма"])} ₽</div>
                    </li>`;*/
                });
                //subcatText += '</ul>';
                if (category == activeCategory && rm == activeRoom){
                    li_category += `<li>
                        <div class="li_left">${category}</div>
                        <div class="li_right">${Math.ceil(summ)} ₽</div>
                    </li>`;
                } else {
                    li_category += `<li>
                        <div class="li_left">${category}</div>
                        <div class="li_right">${Math.ceil(summ)} ₽</div>
                    </li>`;
                }
            });
            if (rm == activeRoom) {
                $('.ul_room').append(`<li>${rm}<ul class="ul_category">${li_category}</ul></li>`);
            } else {
                $('.ul_room').append(`<li>${rm}<ul class="ul_category" style="display:none;">${li_category}</ul></li>`);
            }
        });

         $('.total_amount span').text(`${summAll} ₽`);
    }
    var PriceAll = () => {
        if (sessionStorage.getItem('SMETA')){
            var smeta = JSON.parse(sessionStorage.getItem('SMETA'));

            $('ul.ul_category').removeAttr('id');

            var room = $('#activeRoom p:eq(0)').text();
            var arrCategory = $('.tj_text');
            var arrCat = [];
            for (var i=0; i < arrCategory.length; i++){
                arrCat.push($(arrCategory[i]).attr('title'));
            }

            if (Object.keys(smeta).indexOf(room) != -1) {
                Object.keys(smeta[room]).map(category => {
                    Object.keys(smeta[room][category]).map(subcat => {
                        var arr = smeta[room][category][subcat];

                        if (arrCat.indexOf(category) != -1){
                            var parents = $(arrCategory[arrCat.indexOf(category)]).parents();
                            for (var i=0; i < parents.length; i++){
                                if ($(parents[i]).attr('id') != undefined) {
                                    var arrLI = parents[i].children[1].children;
                                    for (var x=0; x < arrLI.length; x++){
                                        if (arrLI[x].children[0].textContent == subcat){
                                            $(arrLI[x].children[1]).text(arr[arr.length-1]["Сумма"]);
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                    });
                });
            } else {
                return;
            }

        } else{
            return;
        }
    }

    // АВТРИЗАЦИЯ ПОЛЬЗОВАТЕЛЕЙ В СИСТЕМЕ
    $('#submit_login').on('click', (e)=> {
        e.preventDefault();
    
        var data = {
            login: $('#login').val(),
            password: $('#password').val(),
        };
    
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/api/auth/login'
        }).done(function(data){
            if(!data.ok){
                
                $('.status').text(data.error);
                $('.status').css('opacity', 1);
                
                if (data.fields){
                    data.fields.forEach(function(item){
                        $('input[id=' + item + ']').addClass('error');
                    });
                }
            }else{
                $(location).attr('href', '/');
            }
        });
    });

    if (window.location.pathname == '/user/smeta') {
        if (sessionStorage.getItem('SMETA')) {
            var smeta = JSON.parse(sessionStorage.getItem('SMETA'));

            Object.keys(smeta).map(room => {
                var categorySumm = 0;
                Object.keys(smeta[room]).map(category => {
                    $('#table_smeta tbody').append(`
                    <tr style="background-color: rgb(153, 189, 249, 0.7)">
                        <td colspan="5" style="text-align: center; font-weight: bold;">${room}. ${category}</td>
                    </tr>
                    `);
                    Object.keys(smeta[room][category]).map(subcat => {
                        $('#table_smeta tbody').append(`
                        <tr style="border-right: 2px solid black; border-left: 2px solid black; border-top: 2px solid black;">
                            <td colspan="5" style="text-align: left; font-weight: bold;">${subcat}</td>
                        </tr>
                        `)
                        var arr = smeta[room][category][subcat];
                        for (var i=0; i < arr.length-1; i++){
                            $('#table_smeta tbody').append(`
                            <tr style="border-right: 2px solid black; border-left: 2px solid black;">
                                <td>${arr[i]['Название']}</td>
                                <td>${arr[i]['Ед. изм.']}</td>
                                <td>${arr[i]['Количество']}</td>
                                <td>${Math.round(arr[i]['Цена']).toFixed(2)}</td>
                                <td>${Math.round(arr[i]['Сумма']).toFixed(2)}</td>
                            </tr>
                            `);
                        }
                        categorySumm += arr[arr.length-1]["Сумма"];
                        $('#table_smeta tbody').append(`
                        <tr style="border: 2px solid black; background-color: rgb(249, 248, 154, 0.3)">
                            <td colspan="4" style="text-align: right;">Итого по разделу (${category.toLowerCase()})</td>
                            <td style="font-weight: bold;">${arr[arr.length-1]["Сумма"].toFixed(2)}</td>
                        </tr>
                        `);
                    });
                });
                $('#table_smeta tbody').append(`
                    <tr style="border: 2px solid black; background-color: rgb(247, 195, 118, 0.7)">
                        <td colspan="4" style="text-align: right;">ИТОГО ПО ПОМЕЩЕНИЮ. СТОИМОСТЬ РАБОТ</td>
                        <td style="font-weight: bold;">${categorySumm.toFixed(2)}</td>
                    </tr>
                `)
                $('#table_smeta tbody').append(`
                <tr style="height: 20px">
                    <td colspan="5"></td>
                </tr>
                `);
            })
        }
    } else if(window.location.pathname == '/user/newdocument'){
        if (sessionStorage.getItem('SMETA') && sessionStorage.getItem('ROOMS')){
            var smeta = JSON.parse(sessionStorage.getItem('SMETA'));
            var rooms = JSON.parse(sessionStorage.getItem('ROOMS'));

            $('.info_document').hide();
            $('.body_lr').show();
            $('#back_navigation').hide();
            $('.h_content_body').show();

            var numRoom = 0;

            Object.keys(rooms).map(room => {

                $('.NameRoom').text(room);

                $('.room').removeAttr('id');
                $('.room_add').before(`<div class="room" id="activeRoom">
                    <p>${room}</p>
                    <p hidden>${rooms[room]['typeRoom']}</p>
                    <p hidden>${rooms[room]['numRoom']}</p>
                </div>`);

                $('#perimetr_room').text(rooms[room]["perimetr"]);
                $('#floor_area_room').text(rooms[room]["floorArea"]);
                $('#wall_area_room').text(rooms[room]["wallArea"]);

                numRoom = rooms[room]['numRoom'];
            });

            $.ajax({
                type: 'POST',
                data: JSON.stringify({numRoom: numRoom}),
                contentType: 'application/json',
                url: '/api/finddata/findcategories'
            }).done(async function(data){
                if(data.ok){

                    $('.body_r_type_jobs').text("");
                    var item = [];
                    var col = 0;
                    Object.keys(data.data).map(it => {
                        var text = (
                            `
                            <div class="type_jobs_item" id="item_${col}">
                            <div class="type_jobs">
                                <div class="tj_text" title="${it}">${it.split(' ')[0]}</div>
                            </div>
                            <ul class="category" style="display: none;">
                            `
                        )
                        var name = data.data[it].name;
                        for (var i=0; i < name.length; i++){
                            text += `
                            <li>
                                <div class="li_left">${name[i]}</div>
                                <div class="li_right">0 ₽</div>
                            </li>
                            `
                        }
                        text += `</ul></div>`
                        item.push(text);
                        col++;
                    });

                    var arrCol = [];
                    for (var i=0; i < item.length; i+=2){
                        var text = `<div class="type_jobs_col">`
                        for (var x=0; x < 2; x++){
                            if (i+x < item.length){
                                text += item[i+x];
                            } else{
                                break;
                            }
                        }
                        arrCol.push(text + '</div>');
                    }
                    for(var x=0; x < arrCol.length; x++){
                        $('.body_r_type_jobs').append(arrCol[x]);
                    }

                    $('.body_r_type_jobs').show(100);
                    $('.body_r_content').hide();

                    await PriceAll();
                    await Сonsolidated();

                    $('.body_rm').show();

                } else{
                    console.log(data);
                }
            });


        }
    }

    // Сброс класса ERROR
    $(document).delegate( "input, select, textarea", "focus", (e) => {
        $('input').removeClass('error')
        $('select').removeClass('error')
        $('.status_body').css('opacity', 0);
        $('p.error').remove();
    });

    $('.h_user img').on('click', (e) => {
        $(location).attr('href', '/login');
    });

    $('.item_left').on('click', (e) => {
        $('.item_left').attr('id', '');
        var name = '';
        if (e.target.tagName == 'DIV'){
            name = e.target.children[1].textContent;
            e.target.id = 'active_item_left';
        } else {
            name = e.target.parentElement.children[1].textContent;
            e.target.parentElement.id = 'active_item_left';
        }
        $('.title_name').text(name);
        if (name.toLowerCase() == 'пользователи') {
            $('.title_menu ul li').remove();
            $('.title_menu ul').html('<li id="active_menu_item">Все пользователи</li><li>Создать пользователя</li>');
            pageUsers();
        } else if (name.toLowerCase() == 'сметы'){
            $('.title_menu ul li').remove();
            $('.title_menu ul').html('<li id="active_menu_item">Все сметы</li><li>Создать смету</li>');
            pageDocuments();
        } else if (name.toLowerCase() == 'прайс и материалы'){
            $('.title_menu ul li').remove();
            $('.title_menu ul').html(`
                <li id="active_menu_item">Архитектура сметы</li>
                <li>Комнаты</li>
                <li>Тип работ</li>
                <li>Объект работ</li>
                <li>Наименование работ</li>
            `); //<li>Зугрузить Excel</li> - этот пункт нахер не нужен, так как будет доступно это в "Наименование работ"
            pagePrices();
        }
    });
    $(document).delegate( ".title_menu ul li", "click", (e) => {
        $('.title_menu ul li').attr('id', '');
        e.target.id = 'active_menu_item';

        var menuItem = $('#active_item_left p').text();
        if (menuItem == 'Пользователи'){
            pageUsers();
        } else if (menuItem == 'Сметы'){
            pageDocuments();
        } else if (menuItem == 'Прайс и материалы'){
            pagePrices();
        }

    });

    // Поведение элементов формы
    $(document).delegate( "#fio", "keyup", (e) => {
        var fio = $('#fio').val().split(' ');
        var f = fio[0] || '';
        var i = fio[1] || '';
        var o = fio[2] || '';

        var inicial = f.charAt(0).toUpperCase() + i.charAt(0).toUpperCase() + o.charAt(0).toUpperCase();

        $('#inicial').val(inicial);
    })
    $(document).delegate( "#numberFio", "change", (e) => {

        var fio = $('#fio').val().split(' ');
        var f = fio[0] || '';
        var i = fio[1] || '';
        var o = fio[2] || '';

        var inicial = f.charAt(0).toUpperCase() + i.charAt(0).toUpperCase() + o.charAt(0).toUpperCase();

        if ($('#numberFio option:selected').text() != 'Номер'){
            $('#inicial').val(inicial + $('#numberFio option:selected').text());
        } else {
            $('#inicial').val(inicial);
        }
    });
    $(document).delegate( "#create_user", "click", (e) => {
        var data = {
            fio: $('#fio').val(),
            numberFio: $('#numberFio option:selected').text(),
            telephone: $('#telephone').val(),
            birthday: $('#birthday').val(),
            typePeople: $('#typePeople option:selected').text(),
            login: $('#login_sm').val(),
            password: $('#password_sm').val(),
            status: 'Работает'
        }

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/api/savedata/newpeople'
        }).done(function(data){
            if(data.ok){
                $('.status_body').text(data.text);
                $('.status_body').css({
                    "opacity": 1,
                    "color": "green"
                })
            } else{
                data.fields.map(f => {
                    $('#' + f).addClass('error');
                })
                $('.status_body').text(data.text);
                $('.status_body').css({
                    "opacity": 1,
                    "color": "red"
                })
            }
        });

    });

    $('#close_new_room').on('click', (e) => {
        $('.room_room').animate({"opacity": 0}, 300, () => {
            $('.new_room').hide();
            $('.room_room input').val('');
            $('#type_room option').removeAttr('selected');
            $('#name_room option').removeAttr('selected');
            $('#name_room option[value="none"]').attr('selected', "true");
            $('#type_room option[value="none"]').attr('selected', "true");
            $('#name_room').show();
            $('#name_room_i').hide();
            $('.other_col p').text('Свое название');
            $('.other_col p').attr('title', 'Позволяет задать свое название комнаты');
        });
    });

    $('.room_add').on('click', (e) => {
        $('.new_room').show();
        $('.room_room').animate({"opacity": 1}, 300);
    });

    // Записывать комнаты в созданный документ - !!!
    $('#create_room').on('click', (e) => {
        if ($('.other_col p').text() == 'Свое название'){
            var name = $('#name_room option:selected').text();
        } else {
            var name = $('#name_room_i').val();
        }
        var type = $('#type_room option:selected').text();
        var length = $('#lenght_r').val();
        var height = $('#height_r').val();
        var width = $('#width_r').val();
        var opening = $('#opening_r').val();

        var fields = [];

        if ((name == "Название комнаты" || !name) || type == 'Тип комнаты' || !length || !height || !width || !opening){
            if (name == "Название комнаты" || !name) {fields.push('name_room'); fields.push('name_room_i')}
            if (type == 'Тип комнаты') fields.push('type_room');
            if (!length) fields.push('lenght_r');
            if (!height) fields.push('height_r');
            if (!width) fields.push('width_r');
            if (!opening) fields.push('opening_r');

            fields.map(f => {
                $('#' + f).addClass('error');
            });

            $('.status_body').text('Не все поля заполнены!');
            $('.status_body').css({
                "opacity": 1,
                "font-size": "16px",
                "color": "red"
            });
        } else {
            $('.room_room').animate({"opacity": 0}, 300, () => {
                $('.new_room').hide();
                $('.room_room input').val('');
                $('#type_room option').removeAttr('selected');
                $('#name_room option').removeAttr('selected');

                $('#name_room option[value="none"]').attr('selected', "true");
                $('#type_room option[value="none"]').attr('selected', "true");
                $('#name_room').show();
                $('#name_room_i').hide();
                $('.other_col p').text('Свое название');
                $('.other_col p').attr('title', 'Позволяет задать свое название комнаты');
            });
            var len = $('.room').length;
            var num = 1;
            var numRoom = $('#type_room option:selected').val();
            for (var i=0; i<len; i++){
                if ($(`.room:eq(${i}) p:eq(1)`).text() == name){
                    num += 1;
                }
            }

            console.log(num);

            if (num == 1) {
                name = name + ' №1';
            } else {
                name+= ' №'+num
            }

            $('.room').removeAttr('id');
            $('.room_add').before(`<div class="room" id="activeRoom">
                <p>${name}</p>
                <p hidden>${type}</p>
                <p hidden>${numRoom}</p>
            </div>`);

            if (sessionStorage.getItem('ROOMS')) {
                var rooms = JSON.parse(sessionStorage.getItem('ROOMS'));
            } else {
                var rooms = {};
            }

            var perimetr = $('#perimeter').val();
            var floorArea = $('#floor_area').val();
            var wallArea = $('#wall_area').val();

            rooms[name] = {
                perimetr: $('#perimeter').val(),
                floorArea: $('#floor_area').val(),
                wallArea: $('#wall_area').val(),
                typeRoom: type,
                numRoom: numRoom
            }

            $('.NameRoom').text(name);
            $('.h_content .h_content_body').show();

            $('#perimetr_room').text(perimetr);
            $('#floor_area_room').text(floorArea);
            $('#wall_area_room').text(wallArea);

            sessionStorage.setItem('ROOMS', JSON.stringify(rooms));

            $.ajax({
                type: 'POST',
                data: JSON.stringify({numRoom: numRoom}),
                contentType: 'application/json',
                url: '/api/finddata/findcategories'
            }).done(function(data){
                if(data.ok){

                    $('.body_r_type_jobs').text("");
                    var item = [];
                    var col = 0;
                    Object.keys(data.data).map(it => {
                        var text = (
                            `
                            <div class="type_jobs_item" id="item_${col}">
                            <div class="type_jobs">
                                <div class="tj_text" title="${it}">${it.split(' ')[0]}</div>
                            </div>
                            <ul class="category" style="display: none;">
                            `
                        )
                        var name = data.data[it].name;
                        for (var i=0; i < name.length; i++){
                            text += `
                            <li>
                                <div class="li_left">${name[i]}</div>
                                <div class="li_right">0 ₽</div>
                            </li>
                            `
                        }
                        text += `</ul></div>`
                        item.push(text);
                        col++;
                    });

                    var arrCol = [];
                    for (var i=0; i < item.length; i+=2){
                        var text = `<div class="type_jobs_col">`
                        for (var x=0; x < 2; x++){
                            if (i+x < item.length){
                                text += item[i+x];
                            } else{
                                break;
                            }
                        }
                        arrCol.push(text + '</div>');
                    }
                    for(var x=0; x < arrCol.length; x++){
                        $('.body_r_type_jobs').append(arrCol[x]);
                    }

                    $('.body_r_type_jobs').show(100);
                    $('.body_r_content').hide();

                } else{
                    console.log(data);
                }
            });
        }
    });

    $('#lenght_r, #width_r').on('keyup', (e) => {
        var length = $('#lenght_r').val();
        var width = $('#width_r').val();

        if (length && width){
            $('#perimeter').val((length*2+width*2).toFixed(2));
            $('#floor_area').val((length*width).toFixed(2));
        }
    });
    $('#height_r, #opening_r').on('keyup', (e) => {
        var per = $('#perimeter').val();
        var height = $('#height_r').val();
        var opening = $('#opening_r').val();
        if (per){
            $('#wall_area').val((per*height-opening).toFixed(2));
        }
    });

    $('.other_col p').on('click', (e) => {
        if (e.target.textContent == "Свое название"){
            $('#name_room_i').show();
            $('#name_room').hide();
            e.target.textContent = "Шаблонное название";
            e.target.setAttribute('title', 'Позволяет выбрать название комнаты из списка');
        } else {
            $('#name_room_i').hide();
            $('#name_room').show();
            $('#name_room_i').val("");
            e.target.textContent = "Свое название";
            e.target.setAttribute('title', 'Позволяет задать свое название комнаты');
        }
    });

    $(document).delegate(".type_jobs_col", "click", (e) => {

        var parent =  $(e.target).parents();

        $('.type_jobs_item ul').hide();
        $('.type_jobs').show();

        if (e.target.className == 'tj_text' || e.target.className == 'tj_icon') {
            //$(e.target.parentElement).hide();

            for (var i = 0; i < parent.length; i++){
                if (parent[i].id != ""){
                    $('#'+parent[i].id + ' ul').show(100);
                    break;
                }
            }
        } else if (e.target.className == 'type_jobs') {
            //$(e.target).hide();

            for (var i = 0; i < parent.length; i++){
                if (parent[i].id != ""){
                    $('#'+parent[i].id + ' ul').show(100);
                    break;
                }
            }
        }
    })
    $(document).delegate(".category li", "click", (e) => {
        $('.type_jobs_item ul').hide();
        $('.type_jobs').show();

        if (e.target.tagName == "DIV" && e.target.className == "li_left"){
            var subcategory = e.target.textContent;
        } else if (e.target.tagName == "DIV" && e.target.className == "li_right") {
            var subcategory = e.target.parentElement.children[0].textContent;
        } else {
            var subcategory = e.target.children[0].textContent;
        }

        $('.body_r_content').show();

        // ЗАПРОС РАБОТ ПО ВЫБРАННЫМ ПАРАМЕТРАМ
        var parent =  $(e.target).parents();

        for (var i = 0; i < parent.length; i++){
            if (parent[i].id != ""){
                var category = $('#'+parent[i].id + ' .type_jobs .tj_text').attr('title');
                break;
            }
        }

        $('.body_r_content .title_rcb h3').text(category + ' → ' + subcategory);
        var numRoom = $('#activeRoom p:eq(2)').text();

        var room = $('#activeRoom p:eq(0)').text();

        var data = {
            subcategory: subcategory,
            category: category,
            numRoom: numRoom
        }

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/api/finddata/findjobs'
        }).done(function(data){
            if(data.ok){
                $('.table_data tbody').text("");

                if (sessionStorage.getItem('SMETA')){
                    var smeta = JSON.parse(sessionStorage.getItem('SMETA'));
                } else {
                    var smeta = false;
                }

                for (var x=0; x < data.data.length; x++){

                    var name = data.data[x].Name;
                    var col = 1;

                    if (smeta) { 
                        if (Object.keys(smeta).indexOf(room) != -1){
                            if (Object.keys(smeta[room]).indexOf(category) != -1){
                                if (Object.keys(smeta[room][category]).indexOf(subcategory) != -1){
                                    var arr = smeta[room][category][subcategory];
                                    for (var z = 0; z < arr.length; z++){
                                        if (arr[z]["ID"] == data.data[x]._id) {
                                            var class_e = ` class="active_tr"`;
                                            var dspl = '';
                                            name = arr[z]["Название"];
                                            col = arr[z]["Количество"];
                                            break;
                                        } else {
                                            var class_e = ``;
                                            var dspl = 'display: none;';
                                        }
                                    }
                                } else {
                                    var class_e = ``;
                                    var dspl = 'display: none;';
                                }
                            } else {
                                var class_e = ``;
                                var dspl = 'display: none;';
                            }
                        } else {
                            var class_e = ``;
                            var dspl = 'display: none;';
                        }
                    } else {
                        var class_e = ``;
                        var dspl = 'display: none;';
                    }


                    $('.table_data tbody').append(`
                        <tr${class_e}>
                            <td>${name}</td>
                            <td><img src="/images/pencil.png" alt="" style="${dspl}" class="edit_name_jb"></td>
                            <td>${data.data[x].UnitMe}</td>
                            <td>${col}</td>
                            <td><img src="/images/pencil.png" alt="" style="${dspl}" class="edit_col_jb"></td>
                            <td>${data.data[x].Price}</td>
                            <td>${data.data[x].Price*col}</td>
                            <td hidden>${data.data[x]._id}</td>
                        </tr>
                    `);
                }

            } else{
                console.log(data);
            }
        });

    })

    $(document).delegate("#upload_file_node", "change", (e) => {

        var formData = new FormData();
        formData.append('file', $('#upload_file_node')[0].files[0]);

        $.ajax({
            type: 'POST',
            url: '/api/savedata/saveexcel',
            data: formData,
            processData: false,
            contentType: false
        }).done(function(data){
            if (data.ok){
                $.ajax({
                    type: 'POST',
                    data: JSON.stringify({path: data.path}),
                    contentType: 'application/json',
                    url: '/api/savedata/savedatafromexcel',
                }).done(function(data){
                    if (data.ok){
                        $('#upload_file_node').val("");
                        alert('Данные успешно загружены');
                        getItemsJobs();
                    } else {
                        alert(data.text);
                    }
                });
            } else {
                console.log(data);
            }
        });
    });
    $(document).delegate("#upload_file_arch", "change", (e) => {

        var formData = new FormData();
        formData.append('file', $('#upload_file_arch')[0].files[0]);

        $.ajax({
            type: 'POST',
            url: '/api/savedata/saveexcel',
            data: formData,
            processData: false,
            contentType: false
        }).done(function(data){
            if (data.ok){
                $.ajax({
                    type: 'POST',
                    data: JSON.stringify({path: data.path}),
                    contentType: 'application/json',
                    url: '/api/savedata/ImportDataByExcelForArch',
                }).done(function(data){
                    if (data.ok){
                        $('#upload_file_arch').val("");
                        alert('Данные успешно загружены');
                        getArchitecture();
                    } else {
                        alert(data.text);
                    }
                });
            } else {
                console.log(data);
            }
        });
    });

    $('#createDocument').on('click', (e) => {

        var datas = {
            id: $('#idObject').val(),
            dateCreated: $('#dateCreateSmeta').val(),
            adress: $('#adressObject').val(),
            name: $('#nameClient').val(),
            phone: $('#phoneClient').val()
        }

        $.ajax({
            type: 'POST',
            data: JSON.stringify(datas),
            contentType: 'application/json',
            url: '/api/savedata/newdocument'
        }).done(function(data){
            if(data.ok){
                $('.info_document').hide();
                $('.body_lr').show();
                $('#back_navigation').hide();
                datas.idDB = data.data
                sessionStorage.setItem('OBJECT', JSON.stringify(datas));
            } else{
                data.fields.map(m => {
                    $('#' + m).addClass('error');
                });

                $('.status_body').css('opacity', 1);
                $('.status_body').text(data.text);
            }
        });
    })

    $(document).delegate(".table_data tbody tr", "click", (e) => {

        var cls = $($(e.target).closest('table')[0]).attr('class');

        if (cls.indexOf('table_60') == -1 && cls.indexOf('table_80') == -1) {

            var parents = $(e.target).parents();

            if (e.target.tagName != "IMG" && e.target.tagName != "INPUT"){

                for (var x=0; x < parents.length; x++){
                    if (parents[x].tagName == "TR"){
                        if (parents[x].className == "active_tr") {
                            $(parents[x]).removeClass('active_tr');
                            $(parents[x].children[1].children[0]).hide();
                            $(parents[x].children[4].children[0]).hide();
                            if ($('.table_data thead tr th span').text() == "Показать все"){
                                $(parents[x]).hide();
                            }

                        } else {
                            $(parents[x]).addClass('active_tr');
                            $(parents[x].children[1].children[0]).show();
                            $(parents[x].children[4].children[0]).show();
                        }

                        break;
                    }
                }

                var room = $('#activeRoom p:eq(0)').text();
                var category = $('.title_rcb h3').text().split(' → ')[0];
                var subcategory = $('.title_rcb h3').text().split(' → ')[1];

                if (sessionStorage.getItem('SMETA')){
                    var smeta = JSON.parse(sessionStorage.getItem('SMETA'));
                    
                } else {
                    var smeta = {}
                }

                var jobs = [];

                var table = $('.table_data tbody tr.active_tr');

                var summ = 0;
                for (var i=0; i < table.length; i++) {
                    jobs.push({
                        "Название": table[i].children[0].textContent,
                        "Ед. изм.": table[i].children[2].textContent,
                        "Количество": table[i].children[3].textContent,
                        "Цена": table[i].children[5].textContent,
                        "Сумма": table[i].children[6].textContent,
                        "ID": table[i].children[7].textContent
                    });
                    summ += Number(table[i].children[6].textContent);
                }
                jobs.push({
                    "Сумма": summ
                });

                refreshSummSubCategory(category, subcategory, summ);

                if (Object.keys(smeta).indexOf(room) != -1){
                    if (Object.keys(smeta[room]).indexOf(category) != -1){
                        smeta[room][category][subcategory] = jobs;
                    } else {
                        var aSubcategory = {};
                        var aCategory = smeta[room];
                        aSubcategory[subcategory] = jobs;
                        aCategory[category] = aSubcategory;
                        smeta[room] = aCategory;
                    }
                } else {
                    var aSubcategory = {};
                    var aCategory = {};
                    aSubcategory[subcategory] = jobs;
                    aCategory[category] = aSubcategory;
                    smeta[room] = aCategory;
                }
                
                sessionStorage.setItem('SMETA', JSON.stringify(smeta));

                var rooms = JSON.parse(sessionStorage.getItem('ROOMS'));

                Object.keys(smeta).map(room => {
                    smeta[room].floorArea = rooms[room].floorArea;
                    smeta[room].numRoom = rooms[room].numRoom;
                    smeta[room].perimetr = rooms[room].perimetr;
                    smeta[room].typeRoom = rooms[room].typeRoom;
                    smeta[room].wallArea = rooms[room].wallArea;
                });

                var data = {
                    id: JSON.parse(sessionStorage.getItem('OBJECT')).idDB,
                    data: smeta
                }

                $.ajax({
                    type: 'POST',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    url: '/api/updatedata/rooms'
                }).done(function(data){
                    if(!data.ok){
                        alert("ОШИБКА ЗАПИСИ!");
                    }
                });


                Сonsolidated();
            }

            $('.body_rm').show();

        }
        
    })

    $('#name_room').on('change', (e) => {
        var nameRoom = $('#name_room option:selected').val();
        $(`#type_room option[value="${nameRoom}"]`).attr("selected", true);
    })

    $(document).delegate('.table_data tbody tr td img', 'click', (e) => {

        let cls = $($(e.target).closest('td')[0]).attr('class');

        if (cls != 'editLine' && cls != 'removeLine') {

            var parents = $(e.target).parents();
            for (var i=0; i < parents.length; i++){
                if (parents[i].tagName == "TR"){
                    var tr = parents[i];
                }
            }

            var room = $('#activeRoom p:eq(0)').text();
            var category = $('.title_rcb h3').text().split(' → ')[0];
            var subcategory = $('.title_rcb h3').text().split(' → ')[1];
            var id_job = $(tr.children[7]).text();

            var smeta = JSON.parse(sessionStorage.getItem('SMETA'));
            var arrJobs = smeta[room][category][subcategory];

            if (e.target.className == "edit_name_jb"){
                var name = $(tr.children[0]).text();
                $(tr.children[0]).html(`<input type="text" class="table_input" value="${name}">`);
                $(tr.children[1]).html(`<img src="/images/save_i.png" alt="" style="" class="ok_name_jb">`);
            } else if(e.target.className == "edit_col_jb") {
                var name = $(tr.children[3]).text();
                $(tr.children[3]).html(`<input type="text" class="table_input" value="${name}" style="text-align: center;">`);
                $(tr.children[4]).html(`<img src="/images/save_i.png" alt="" style="" class="ok_col_jb">`);
            } else if(e.target.className == "ok_name_jb"){
                var name = $(tr.children[0].children[0]).val();
                $(tr.children[0]).text(name);
                $(tr.children[1]).html(`<img src="/images/pencil.png" alt="" style="" class="edit_name_jb">`);

                for (var i=0; i < arrJobs.length-1; i++) {
                    if (arrJobs[i]['ID'] == id_job) {
                        arrJobs[i]['Название'] = $(tr.children[0]).text();
                        arrJobs[i]['Количество'] = $(tr.children[3]).text();
                        arrJobs[i]['Сумма'] = $(tr.children[6]).text();
                    }
                }

            } else if (e.target.className == "ok_col_jb") {
                var name = $(tr.children[3].children[0]).val();
                $(tr.children[3]).text(name);
                $(tr.children[4]).html(`<img src="/images/pencil.png" alt="" style="" class="edit_col_jb">`);

                var price = $(tr.children[5]).text();
                $(tr.children[6]).text(price*name);

                var newSum = 0;
                for (var i=0; i < arrJobs.length-1; i++) {
                    if (arrJobs[i]['ID'] == id_job) {
                        arrJobs[i]['Название'] = $(tr.children[0]).text();
                        arrJobs[i]['Количество'] = $(tr.children[3]).text();
                        arrJobs[i]['Сумма'] = $(tr.children[6]).text();
                    }
                    newSum += Number(arrJobs[i]['Сумма']);
                }
                arrJobs[arrJobs.length-1]["Сумма"] = newSum;

                refreshSummSubCategory(category, subcategory, newSum);

            }
            smeta[room][category][subcategory] = arrJobs;
            sessionStorage.setItem('SMETA', JSON.stringify(smeta));
            Сonsolidated();

        } else if (cls == 'editLine') {
            let id = $($($(e.target).closest('tr')[0]).find('td')[0]).text();
            sessionStorage.setItem('RowInfo', JSON.stringify({id}));
            CreateOrEditNewElement('Edit');
        } else if (cls == 'removeLine') {
            let id = $($($(e.target).closest('tr')[0]).find('td')[0]).text();
            sessionStorage.setItem('RowInfo', JSON.stringify({id}));
            RemoveRecord();
        }

    });

    $('.table_data thead tr th span').on('click', (e) => {
        if ($('.table_data thead tr th span').text() == "Показать выбранные") {
            $('.table_data tbody tr').hide();
            $('.table_data tbody tr.active_tr').show();
            $('th span').text('Показать все');
        } else {
            $('.table_data tbody tr').show();
            $('th span').text('Показать выбранные');
        }
    });

    $(document).mouseup(function (e) {
        var container = $("ul.category");
        if (container.has(e.target).length === 0){
            container.hide();
        }
    });

    $(document).delegate('.room', 'click', (e) => {
        if (e.target.tagName == "DIV"){
            $('.room').removeAttr('id');
            $(e.target).attr('id', 'activeRoom');
        } else {
            $('.room').removeAttr('id');
            $(e.target.parentElement).attr('id', 'activeRoom');
        }

        var numRoom = $('#activeRoom p:eq(2)').text();
        var name = $('#activeRoom p:eq(0)').text();

        var rooms = JSON.parse(sessionStorage.getItem('ROOMS'));

        $('.NameRoom').text(name);
        $('#perimetr_room').text(rooms[name].perimetr);
        $('#floor_area_room').text(rooms[name].floorArea);
        $('#wall_area_room').text(rooms[name].wallArea);

        $('.body_r_content').hide();

        $.ajax({
            type: 'POST',
            data: JSON.stringify({numRoom: numRoom}),
            contentType: 'application/json',
            url: '/api/finddata/findcategories'
        }).done(async function(data){
            if(data.ok){

                $('.body_r_type_jobs').text("");
                var item = [];
                var col = 0;
                Object.keys(data.data).map(it => {
                    var text = 
                        `
                        <div class="type_jobs_item" id="item_${col}">
                        <div class="type_jobs">
                            <div class="tj_text" title="${it}">${it.split(' ')[0]}</div>
                        </div>
                        <ul class="category" style="display: none;">
                        `
                    var name = data.data[it].name;
                    for (var i=0; i < name.length; i++){
                        text += `
                        <li>
                            <div class="li_left">${name[i]}</div>
                            <div class="li_right">0 ₽</div>
                        </li>
                        `
                    }
                    text += `</ul></div>`
                    item.push(text);
                    col++;
                });

                var arrCol = [];
                for (var i=0; i < item.length; i+=2){
                    var text = `<div class="type_jobs_col">`
                    for (var x=0; x < 2; x++){
                        if (i+x < item.length){
                            text += item[i+x];
                        } else{
                            break;
                        }
                    }
                    arrCol.push(text + '</div>');
                }

                for(var x=0; x < arrCol.length; x++){
                    $('.body_r_type_jobs').append(arrCol[x]);
                }

                $('.body_r_type_jobs').show(100);

                await PriceAll();
                await Сonsolidated();

            } else{
                console.log(data);
            }
        });

    })

    $(document).delegate('.ul_room li', 'click', (e) => {
        $(e.target.children[0]).toggle(100);
    });

    $('#CreateSmeta').on('click', (e) => {
        window.location.href = '/user/smeta';
    })

    $(document).delegate('#close_modal', 'click', (e) => {
        $('.background_modal').hide();
        $('body').css('overflow', 'auto');
    });

    $(document).delegate('.create_new', 'click', (e) => {
        CreateOrEditNewElement('Create');
    });
    $(document).delegate('.createRecord', 'click', (e) => {
        let id = e.target.id;
        var data = {};
        if (id != 'ButJob') {
            data.Name = $('.room_row input').val();
            data.Type = id;
        } else {
            data.Name = $('#NameJob').val();
            data.UnitMe = $('.room_row select option:selected').text();
            data.Price = $('#Price').val();
            data.Type = id;
        }

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/api/savedata/saveNewRecordSmetaSettings'
        }).done(data => {
            if(data.ok){
                console.log(data);
                resetValueInputAndSelect();
                $('.background_modal').hide();
                SelectQueryActiveItemMenu();
            } else {
                RequestError(data);
            }
        });

    });
    $(document).delegate('.editRecord', 'click', (e) => {
        let id = e.target.id;
        var data = {};
        if (id != 'ButJob') {
            data.Name = $('.room_row input').val();
            data.Type = id;
        } else {
            data.Name = $('#NameJob').val();
            data.UnitMe = $('.room_row select option:selected').text();
            data.Price = $('#Price').val();
            data.Type = id;
        }
        data.Id = JSON.parse(sessionStorage.getItem('RowInfo')).id;

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/api/updatedata/editRecordSmetaSettings'
        }).done(data => {
            if(data.ok){
                console.log(data);
                resetValueInputAndSelect();
                $('.background_modal').hide();
                SelectQueryActiveItemMenu();
            } else {
                RequestError(data);
            }
        });
    })

});  

        const playlist_url = document.getElementById('playlist_url');
        const scrape_btn = document.getElementById('scrape_btn');
        const playlist_info = document.getElementById('playlist_info');
        const playlist_thumb = document.getElementById('playlist_thumb');
        const playlist_title = document.getElementById('playlist_title');
        const playlist_desc = document.getElementById('playlist_desc');
        const video_count = document.getElementById('video_count');
        const channel_name = document.getElementById('channel_name');
        const total_duration = document.getElementById('total_duration');
        const last_updated = document.getElementById('last_updated');
        const videos_grid = document.getElementById('videos_grid');
        const visual_empty = document.getElementById('visual_empty');
        const json_output = document.getElementById('json_output');
        const advanced_json_output = document.getElementById('advanced_json_output');
        const copy_json_btn = document.getElementById('copy_json_btn');
        const copy_advanced_btn = document.getElementById('copy_advanced_btn');
        const copy_endpoint_btn = document.getElementById('copy_endpoint_btn');
        const test_endpoint_btn = document.getElementById('test_endpoint_btn');

        const visual_tab_btn = document.querySelector('.view-tab[data-tab="visual"]');
        const json_tab_btn = document.querySelector('.view-tab[data-tab="json"]');
        const advanced_tab_btn = document.querySelector('.view-tab[data-tab="advanced"]');


        function hide_all_tabs() {
            document.getElementById('visual-tab').style.display = 'none';
            document.getElementById('json-tab').style.display = 'none';
            document.getElementById('advanced-tab').style.display = 'none';

            visual_tab_btn.classList.remove('active');
            json_tab_btn.classList.remove('active');
            advanced_tab_btn.classList.remove('active');
        }





        function showEmptyWidget() {
            visual_empty.style.display = 'flex';
            playlist_info.style.display = 'none';    
            videos_grid.style.display = 'none';      
        }

      

        function hideEmptyWidget() {
            visual_empty.style.display = 'none';     
            playlist_info.style.display = 'block';  
            videos_grid.style.display = 'grid';    
        }


        window.addEventListener('DOMContentLoaded', () => {
            showEmptyWidget(); 
        });

        //-------------------------


        //------------TAB SWITCHING----------
        visual_tab_btn.addEventListener('click', () => {

            console.log("visual display clicked");

            hide_all_tabs();
            document.getElementById('visual-tab').style.display = 'block';
            visual_tab_btn.classList.add('active');
        });


        json_tab_btn.addEventListener('click', () => {

            console.log("standard json clicked");

            hide_all_tabs();
            document.getElementById('json-tab').style.display = 'block';
            json_tab_btn.classList.add('active');
        });


        advanced_tab_btn.addEventListener('click', () => {
            console.log("adv json cliced");

            hide_all_tabs();
            document.getElementById('advanced-tab').style.display = 'block';
            advanced_tab_btn.classList.add('active');
        });


        hide_all_tabs();
        document.getElementById('visual-tab').style.display = 'block';
        visual_tab_btn.classList.add('active');

        //---------------TAB SWITCHING ENDS -------------


        let description_data = null;
let info_text = document.getElementById("info_text");
const original_info_html = info_text.innerHTML;
let basicDone = false;
let advDone = false;

const loading_messages = [
  "Waking up the server… it’s grumpy",
  "Convincing electrons to move faster",
  "Starting Selenium… pray for RAM",
  "Playwright is putting on makeup",
  "Accessing API… fingers crossed",
  "Waiting… still waiting…",
  "Processing data with pure vibes",
  "Almost done…",
  "Cleaning up mess we made"
];

scrape_btn.addEventListener('click', () => {
    showEmptyWidget();

    let old_inner_html = scrape_btn.innerHTML;
    scrape_btn.innerHTML = `<i class="fa fa-circle-notch fa-spin"></i> Scraping...`;

    let msg_index = 0;
    info_text.innerHTML = `<i class="fa fa-circle-notch fa-spin"></i> ${loading_messages[msg_index]}`;
    const info_interval = setInterval(() => {
        msg_index = (msg_index + 1) % loading_messages.length;
        info_text.innerHTML = `<i class="fa fa-circle-notch fa-spin"></i> ${loading_messages[msg_index]}`;
    }, 2500);

    function maybeFinish() {
        if (basicDone && advDone) {
            clearInterval(info_interval);
            info_text.innerHTML = original_info_html;
            scrape_btn.innerHTML = old_inner_html;
        }
    }

    advanced_json_output.innerHTML = `<pre id="advanced_json_output"><code>// Fetching Standard JSON data...
// Good things takes time </code></pre>`;
    json_output.innerHTML = `<pre id="advanced_json_output"><code>// Fetching Advance JSON data...
// Good things takes time </code></pre>`;

    fetch("/basic-data", {
        method: 'POST',
        body: JSON.stringify({ "url": playlist_url.value }),
        headers: { "Content-Type": "application/json" }
    })
    .then(res => res.json())
    .then(data => {
        hideEmptyWidget();

        description_data = data.api_data.playlist_info;
        set_playlist_info(data);

        let a = document.getElementById("videos_grid");
        while (a.firstChild) a.removeChild(a.firstChild);

        json_output.innerHTML = `<pre><code>${JSON.stringify(data, null, 2)}</code></pre>`;
        for (let i of data.api_data.data) create_video_card(i);

        basicDone = true;
        maybeFinish();
    })
    .catch(err => {
        console.log(err);
        basicDone = true;
        maybeFinish();
                let a = document.getElementById("videos_grid");
        while (a.firstChild) a.removeChild(a.firstChild);
        showEmptyWidget()
        json_output.innerHTML = `<pre id="advanced_json_output"><code>// Something went wrong while scraping. Try again</code></pre>`;
    });

    fetch("/adv-data", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "url": playlist_url.value })
    })
    .then(res => res.json())
    .then(data => {
        advanced_json_output.innerHTML = `<pre><code>${JSON.stringify(data, null, 2)}</code></pre>`;
        advDone = true;
        maybeFinish();
    })
    .catch(err => {
        console.log(err);
        advDone = true;
        maybeFinish();
        advanced_json_output.innerHTML = `<pre id="advanced_json_output"><code>// Something went wrong while scraping. Try again</code></pre>`;
    });
});



//         let description_data=null;
//         let info_text=document.getElementById("info_text");
//         const original_info_html = info_text.innerHTML
//                 let basicDone = false;
// let advDone = false;
//         const loading_messages = [
//   "Waking up the server… it’s grumpy",
//   "Convincing electrons to move faster",
//   "Starting Selenium… pray for RAM",
//   "Playwright is putting on makeup",
//   "Accessing API… fingers crossed",
//   "Waiting… still waiting…",
//   "Processing data with pure vibes",
//   "Almost done…",
//   "Cleaning up mess we made"
// ];
// function maybeFinish() {
//     if (basicDone && advDone) {
//         clearInterval(info_interval);          // stop cycling
//         info_text.innerHTML = original_info_html; // restore original text
//         scrape_btn.innerHTML = old_inner_html;     // restore button
//     }
// }
//
//         scrape_btn.addEventListener('click', () => {
//             showEmptyWidget();
//
// let msg_index = 0;
// info_text.innerHTML = `<i class="fa fa-circle-notch fa-spin"></i> ${loading_messages[msg_index]}`;
// const info_interval = setInterval(() => {
//     msg_index = (msg_index + 1) % loading_messages.length;
//     info_text.innerHTML = `<i class="fa fa-circle-notch fa-spin"></i> ${loading_messages[msg_index]}`;
// }, 2500);
//
//
//             console.log("scrape button clicked");
//
//             console.log(`input url data ${playlist_url.value}`);
//
//             let old_inner_html = scrape_btn.innerHTML;
//
//             scrape_btn.innerHTML = `<i class="fa fa-circle-notch fa-spin"></i> Scraping...`
//
//
//
//             advanced_json_output.innerHTML = `<pre id="advanced_json_output"><code>// Fetching Standard JSON data...
// // Good things takes time </code></pre>`
//
//
//             json_output.innerHTML = `<pre id="advanced_json_output"><code>// Fetching Advance JSON data...
// // Good things takes time </code></pre>`
//             fetch("/basic-data",{
//                 method: 'POST',
//                 body: JSON.stringify({"url": playlist_url.value}),
//                 headers: {"Content-Type": "application/json"}
//             })
//             .then(res=>res.json())
//             .then(data=>{
//
//                 hideEmptyWidget()
//
//                 console.log("received data from server ", data);
//                 description_data=data.api_data.playlist_info;
//                 console.log(description_data);
//                 set_playlist_info(data)
//
//
//                 let a=document.getElementById("videos_grid")
//                 while (a.firstChild) {
//                     a.removeChild(a.firstChild);
//                 }
//
//
//
//                 json_output.innerHTML = `<pre><code>${JSON.stringify(data, null, 2)}</code></pre>`;
//                 for (let i of data.api_data.data) {
//                     create_video_card(i);
//                 }
//
//                 scrape_btn.innerHTML=old_inner_html;
//     maybeFinish();
//                     basicDone = true;
//                 info_text.innerHTML=old_inner_html;
//             })
//             .catch(err=>{
//                 console.log(err);
//                 scrape_btn.innerHTML = old_inner_html;
//                 json_output.innerHTML=`<pre id="advanced_json_output"><code>// Something went wrong while scraping. Try again</code></pre>`;
//                     basicDone = true;
//     maybeFinish();
//                                 info_text.innerHTML=original_info_html;
//             })
//
//             fetch("/adv-data",{
//                 method: 'POST',
//                 headers: {"Content-Type": "application/json"},
//                 body:JSON.stringify({"url": playlist_url.value}),
//             })
//                 .then(res=>res.json())
//                 .then(data=>{
//
//                     advanced_json_output.innerHTML= `<pre><code>${JSON.stringify(data, null, 2)}</code></pre>`;
//                         advDone = true;
//     maybeFinish();
//                                     info_text.innerHTML=original_info_html;
//
//                 })
//                 .catch(err=>{
//                     console.log(err);
//                     scrape_btn.innerHTML = `<pre id="advanced_json_output"><code>// Something went wrong while scraping. Try again</code></pre>`;
//                         advDone = true;
//     maybeFinish();
//                     info_text.innerHTML=original_info_html;
//                 })
//         })



        function set_playlist_info(x) {
            const t = calculate_total_hours(x);

            //-------first clear old-----------
            playlist_thumb.src = "";
            playlist_title.textContent = "";
            playlist_desc.textContent = "";
            video_count.textContent = "";
            // channel_name.textContent = "CHANNEL NAME";
            total_duration.innerHTML = ``;
            last_updated.textContent = "";

            playlist_info.style.display = 'hidden';


            // created_by
            // :
            // "Shradha Khapra"
            // created_by_link
            // :
            // "https://www.youtube.com/channel/UC1XBh-m27kkgwLAwu_SRJBg"
            // created_on
            // :
            // "2023-11-17T14:47:51.160528Z"
            // last_updated
            // :
            // "2023-12-15T16:12:37Z"
            // playlist_description
            // :
            // "JavaScript is one of the most used coding language by Developers & is heavily used in Website Development. Learning this will give you great edge and confidence for Job preparation. To cover the basics we have also covered HTML & CSS as separate ONE Shot Tutorials on Apna College YouTube channel. \nAdditionally we will do practice qs and several projects to get all round knowledge of this language.\nAll the best Coders❤️"
            // playlist_name
            // :
            // "JavaScript Full Course (2025-26) - Beginners to Pro"
            // video_count
            // :
            // 14

            // dat = data.api_data.playlist_info
            playlist_thumb.src = x.api_data.data[0].thumbnail_247;
            playlist_title.textContent = x.api_data.playlist_info.playlist_name;
            playlist_desc.textContent = x.api_data.playlist_info.playlist_description;
            video_count.textContent = x.api_data.data.length;
            channel_name.textContent = x.api_data.playlist_info.created_by;
            total_duration.innerHTML = `<i class="fa-solid fa-clock clock-spin"></i> ${t.hours} h ${t.minutes} m`;
            last_updated.textContent = x.api_data.playlist_info.last_updated.split("T")[0];

            playlist_info.style.display = 'block';
        }


        function calculate_total_hours(x) {
            let totalSeconds = 0;

            for (let i of x.api_data.data) {
                if (!i.duration || i.duration.trim() === "") continue;

                let p = i.duration.split(':').map(Number);

                if (p.length === 3) totalSeconds += p[0]*3600 + p[1]*60 + p[2];
                else if (p.length === 2) totalSeconds += p[0]*60 + p[1];
                else totalSeconds += p[0];
            }

            return {
                hours: Math.floor(totalSeconds / 3600),
                minutes: Math.floor((totalSeconds % 3600) / 60),
                seconds: totalSeconds % 60
            };
        }




function create_video_card(data){
    let super_parent_div = document.createElement('div');
    super_parent_div.className = "video-card";

    let sp_img_ie_child1 = document.createElement("img");
    sp_img_ie_child1.className = "video-thumb";
    sp_img_ie_child1.src = data.original_thumbnail;
    sp_img_ie_child1.alt = data.title;

    let sp_div1_ie_child2 = document.createElement("div");
    sp_div1_ie_child2.className = "video-info";

    let child2_inner_div1 = document.createElement("div");
    child2_inner_div1.style.display = "flex";
    child2_inner_div1.style.alignItems = "flex-start";
    child2_inner_div1.style.gap = "0.5rem";
    child2_inner_div1.innerHTML = `
        <span class="video-index">${data.index}</span>
        <div class="video-title">${data.title}</div>
    `;

    let child2_inner_div2 = document.createElement("div");
    child2_inner_div2.className = "video-meta";
    child2_inner_div2.innerHTML = `
        <span class="video-duration"><i class="far fa-clock"></i> ${data.duration}</span>
        <span class="video-id">${data.video_id}</span>
    `;

    sp_div1_ie_child2.appendChild(child2_inner_div1);
    sp_div1_ie_child2.appendChild(child2_inner_div2);

    super_parent_div.appendChild(sp_img_ie_child1);
    super_parent_div.appendChild(sp_div1_ie_child2);

    videos_grid.appendChild(super_parent_div);

    // let hoverOverlay = document.createElement("div");
    // hoverOverlay.className = "hover-overlay";
    // hoverOverlay.innerHTML = `
    //     <div class="hover-content">
    //         <pre>${JSON.stringify(data, null, 2)}</pre>
    //     </div>
    //     <div class="hover-actions">
    //         <button class="hover-btn copy-btn" data-id="${data.video_id}">
    //             <i class="far fa-copy"></i> Copy
    //         </button>
    //         <button class="hover-btn view-btn" data-id="${data.video_id}">
    //             <i class="fas fa-external-link-alt"></i> View
    //         </button>
    //     </div>
    // `;
    //
    //
    // // Simple copy function
    // hoverOverlay.querySelector('.copy-btn').addEventListener('click', function(e) {
    //     e.stopPropagation();
    //     const text = JSON.stringify(data, null, 2);
    //     navigator.clipboard.writeText(text).catch(err => {
    //         const textarea = document.createElement('textarea');
    //         textarea.value = text;
    //         document.body.appendChild(textarea);
    //         textarea.select();
    //         document.execCommand('copy');
    //         document.body.removeChild(textarea);
    //     });
    // });
    //
    // // View function
    // hoverOverlay.querySelector('.view-btn').addEventListener('click', function(e) {
    //     e.stopPropagation();
    //     window.open(`https://youtube.com/watch?v=${data.video_id}`, '_blank');
    // });
    // super_parent_div.appendChild(hoverOverlay);
}

    copy_json_btn.addEventListener("click", function(){
        navigator.clipboard.writeText(json_output.innerText);
        console.log("std json copied");
    })

    copy_advanced_btn.addEventListener("click", function(){
        navigator.clipboard.writeText(advanced_json_output.innerText);
        console.log("advanced json copied");
    })




        //----------------URLS--------------------
        let quick_urls = document.getElementById('quick_playlists').getElementsByClassName("playlist-item");
        console.log(`number of childs of urls ${quick_urls.length}`);

        let old_url = playlist_url.value;

        playlist_url.addEventListener("input",()=>{
            old_url=playlist_url.value;
        })
        for (let i of quick_urls) {
            i.addEventListener("mouseover", ()=>{

                playlist_url.value = i.getElementsByClassName("playlist-url")[0].innerText;
            })
            i.addEventListener("mouseout", ()=>{
                playlist_url.value=old_url;
            })

            i.addEventListener("click", ()=>{
                playlist_url.value=i.getElementsByClassName("playlist-url")[0].innerText;
                old_url = playlist_url.value;
            })
        }






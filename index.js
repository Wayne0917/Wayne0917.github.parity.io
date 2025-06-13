const search = document.querySelector('.search');
search.textContent = '資料載入中...';

const box = document.querySelector('.box');      
const textContent = document.querySelector('.textContent');

let vegetablesArr = [];     //蔬菜資料
let fruitArr = [];       //水果資料
let flowerArr = [];     //花卉資料

axios.get('https://data.moa.gov.tw/Service/OpenData/FromM/FarmTransData.aspx?IsTransData=1&UnitId=037')
.then((response) => {
    search.textContent = '請輸入並搜尋想比價的作物名稱^＿^';
    data = response.data;   

    let currentData = [];       // 儲存當前頁面顯示的資料

    //篩選 各種類 ， 並丟資料到對應的陣列
    data.filter((item) =>{
        if (item.種類代碼 === 'N04') {
            vegetablesArr.push(item)
        }else if(item.種類代碼 === 'N05'){
            fruitArr.push(item)
        }else{
            flowerArr.push(item)
        }
    });
    
    //提取各按鈕(快速篩選 蔬菜 水果 花卉)
    const vegetables  = document.querySelector('.vegetables');      //蔬菜按鈕
    const fruit  = document.querySelector('.fruit');        //水果按鈕
    const flower  = document.querySelector('.flower');      //花卉按鈕
    
    //篩選蔬菜功能
    vegetables.addEventListener('click',(e)=>{
        currentData = [...vegetablesArr];       //更新當下的資料
        btn(vegetablesArr);
    });
    //篩選水果功能
    fruit.addEventListener('click',()=>{
        currentData = [...fruitArr];
        btn(fruitArr);
    });
    //篩選花卉功能
    flower.addEventListener('click',()=>{
        currentData = [...flowerArr];
        btn(flowerArr);
    });
    

    //封裝### 篩選按鈕功能(蔬菜 水果 花卉)
    function btn(typeArr){
        search.textContent = '資料載入中...';
        box.innerHTML = '';
        let str = '';
        
        
        typeArr.forEach((item)=>{
            str +=
            `
            <tr class="textContent">
            <td class="crop">${item.作物名稱}</td>
            <td class="market">${item.市場名稱}</td>
            <td class="upPrice">${item.上價}</td>
            <td class="upPrice">${item.中價}</td>
            <td class="downPrice">${item.下價}</td>
            <td class="averagePrice">${item.平均價}</td>
            <td class="tradingVolume">${item.交易量}</td>
            </tr>
            `;
        })
        box.innerHTML = str;
        search.style.display = 'none';
    };


    //提取 作物名稱輸入欄 及 搜尋按鈕
    const  findKeyWord = document.querySelector('.findKeyWord');        //input輸入欄
    const  findBtn = document.querySelector('.findBtn');        //搜尋按鈕
    const  findResult = document.querySelector('.findResult');      //搜尋結果，並顯示在頁面上

    //搜尋按鈕功能
    findBtn.addEventListener('click',(e)=>{
    search.textContent = '資料載入中...';
    box.innerHTML = '';
    search.textContent = '';
        
    const keyWord = findKeyWord.value.trim();
       if (keyWord === '') {
            alert('請填寫正確內容');
            return;
       }

       //建立一個新陣列用來存 有符合 keyword 的 資料
       let keyWordArr = data.filter((item) => {
            return item.作物名稱 && item.作物名稱.includes(keyWord);
       });

       //用來存取 keyword 搜尋出來的當前頁面資料 (方便排序用)
       currentData = keyWordArr;

       str ='';

        if (keyWordArr.length === 0) {
            search.textContent = '查詢不到當日的交易資訊QQ';
        }else{
            findResult.textContent = `查看「${keyWord}」的比價結果，共${keyWordArr.length}筆`
        };

       data.forEach((item) =>{
           if (item.作物名稱 && item.作物名稱.includes(keyWord)) {
            str += `
            <tr class="textContent">
                <td class="crop">${item.作物名稱}</td>
                <td class="market">${item.市場名稱}</td>
                <td class="upPrice">${item.上價}</td>
                <td class="upPrice">${item.中價}</td>
                <td class="downPrice">${item.下價}</td>
                <td class="averagePrice">${item.平均價}</td>
                <td class="tradingVolume">${item.交易量}</td>
            </tr>
            `;
            }
        });
    box.innerHTML = str ;  
    findKeyWord.value = '';
    });
    
    //提取 排序欄
    const sortSelect = document.querySelector('.sortSelect');

    //排序
    sortSelect.addEventListener('change',function (e) { 
        let getOption = e.target.value;

        let sortArr = [...currentData];    //拷貝 蔬菜陣列
        
        if (getOption === '依上價排序') {       
            sortArr.sort((a, b) => b.上價 - a.上價);
        }else if(getOption === '依中價排序'){
            sortArr.sort((a, b) => b.中價 - a.中價);
        }else if(getOption === '依下價排序'){
            sortArr.sort((a, b) => b.下價 - a.下價);
        }else if(getOption === '依平均價排序'){
            sortArr.sort((a, b) => b.平均價 - a.平均價);
        }else if(getOption === '依交易量排序'){
            sortArr.sort((a, b) => b.交易量 - a.交易量);
        }else{
            return;
        }

        let str = '';
        sortArr.forEach((item)=>{
            str +=
            `
            <tr class="textContent">
                <td class="crop">${item.作物名稱}</td>
                <td class="market">${item.市場名稱}</td>
                <td class="upPrice">${item.上價}</td>
                <td class="upPrice">${item.中價}</td>
                <td class="downPrice">${item.下價}</td>
                <td class="averagePrice">${item.平均價}</td>
                <td class="tradingVolume">${item.交易量}</td>
            </tr>
            `;
        });
        box.innerHTML = str;
        sortArr = [];
    });
})
.catch((err) => {
    console.warn(err);
});



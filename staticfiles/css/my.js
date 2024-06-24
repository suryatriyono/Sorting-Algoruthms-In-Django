 // Mengambil data dari server
 const rawData = JSON.parse('{{ data_json|escapejs }}');
 // Mengonversi data menjadi array objek dengan nilai yang bisa digunakan untuk pengurutan
 let array = rawData.map((d, index) => ({
     ...d,
     index: index,
     market_cap_value: convertMarketCap(d.market_cap),
     price_value: convertPrice(d.price),
     change_today_value: convertChangeToday(d.change_today)
 }));
 // Mendapatkan konteks canvas untuk Chart.js
 const ctx = document.getElementById('myChart').getContext('2d');
 let chart;

 // Fungsi untuk mengonversi market cap ke nilai numerik
 function convertMarketCap(market_cap) {
     market_cap = market_cap.replace('$', '').replace(' ', '').replace(',', '');
     let value = parseFloat(market_cap.slice(0, -1));
     let unit = market_cap.slice(-1);

     if (unit === 'T') {
         value = value * 1e12;
     } else if (unit === 'B') {
         value = value * 1e9;
     } else if (unit === 'M') {
         value = value * 1e6;
     }
     return value;
 }

 // Fungsi untuk mengonversi harga ke nilai numerik
 function convertPrice(price) {
     price = price.replace('$', '').replace(' ', '');
     if (price.includes('.') || price.includes(',')) {
         price = price.replace(/\./g, '').replace(/,/g, '');
     }
     return parseFloat(price);
 }

 // Fungsi untuk mengonversi perubahan hari ini ke nilai numerik
 function convertChangeToday(change_today) {
     change_today = change_today.replace('%', '').replace(' ', '').replace(',', '');
     return parseFloat(change_today);
 }

 // Fungsi untuk membuat chart menggunakan Chart.js
 function createChart(arr, key) {
     const labels = arr.map(d => d.name);
     const values = arr.map(d => d[key]);

     if (chart) {
         chart.destroy();
     }

     chart = new Chart(ctx, {
         type: 'bar',
         data: {
             labels: labels,
             datasets: [{
                 label: key.replace('_', ' ').toUpperCase(),
                 data: values,
                 backgroundColor: 'rgba(54, 162, 235, 0.2)',
                 borderColor: 'rgba(54, 162, 235, 1)',
                 borderWidth: 1
             }]
         },
         options: {
             animation: {
                 duration: 0 // menonaktifkan animasi default Chart.js
             },
             scales: {
                 y: {
                     beginAtZero: true
                 }
             }
         }
     });
 }

 // Fungsi untuk menjalankan Merge Sort secara rekursif
 async function mergeSort(arr, l, r, key) {
     if (l >= r) return;

     const mid = l + Math.floor((r - l) / 2);
     await mergeSort(arr, l, mid, key);
     await mergeSort(arr, mid + 1, r, key);
     await merge(arr, l, mid, r, key);
 }

 // Fungsi untuk menggabungkan hasil Merge Sort
 async function merge(arr, l, mid, r, key) {
     const n1 = mid - l + 1;
     const n2 = r - mid;

     const L = new Array(n1);
     const R = new Array(n2);

     for (let i = 0; i < n1; i++) L[i] = arr[l + i];
     for (let i = 0; i < n2; i++) R[i] = arr[mid + 1 + i];

     let i = 0, j = 0, k = l;

     while (i < n1 && j < n2) {
         if (L[i][key] <= R[j][key]) {
             arr[k] = L[i];
             i++;
         } else {
             arr[k] = R[j];
             j++;
         }
         k++;
         await updateChart(arr, key);
         updateTable(arr);
     }

     while (i < n1) {
         arr[k] = L[i];
         i++;
         k++;
         await updateChart(arr, key);
         updateTable(arr);
     }

     while (j < n2) {
         arr[k] = R[j];
         j++;
         k++;
         await updateChart(arr, key);
         updateTable(arr);
     }
 }

 // Fungsi untuk menjalankan Bubble Sort
 async function bubbleSort(arr, key) {
     let n = arr.length;
     for (let i = 0; i < n - 1; i++) {
         for (let j = 0; j < n - i - 1; j++) {
             if (arr[j][key] > arr[j + 1][key]) {
                 [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
             }
             await updateChart(arr, key);
             updateTable(arr);
         }
     }
 }

 // Fungsi untuk menjalankan Shell Sort
 async function shellSort(arr, key) {
     let n = arr.length;
     for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
         for (let i = gap; i < n; i++) {
             let temp = arr[i];
             let j;
             for (j = i; j >= gap && arr[j - gap][key] > temp[key]; j -= gap) {
                 arr[j] = arr[j - gap];
                 await updateChart(arr, key);
                 updateTable(arr);
             }
             arr[j] = temp;
             await updateChart(arr, key);
             updateTable(arr);
         }
     }
 }

 // Fungsi untuk memulai proses sorting
 async function startSort() {
     const sortBy = document.getElementById('sort-select').value;
     const sortMethod = document.getElementById('sort-method-select').value;
     const numRecords = parseInt(document.getElementById('num-records-select').value);
     let limitedArray = array.slice(0, numRecords);
     document.getElementById('sort-button').disabled = true;
     document.getElementById('sort-select').disabled = true;
     document.getElementById('num-records-select').disabled = true;
     document.getElementById('order-select').disabled = true;
     createChart(limitedArray, `${sortBy}_value`);

     // Mengukur waktu mulai sorting
     const startTime = performance.now();

     // Menjalankan metode sorting yang dipilih
     if (sortMethod === 'merge') {
         await mergeSort(limitedArray, 0, limitedArray.length - 1, `${sortBy}_value`);
     } else if (sortMethod === 'bubble') {
         await bubbleSort(limitedArray, `${sortBy}_value`);
     } else if (sortMethod === 'shell') {
         await shellSort(limitedArray, `${sortBy}_value`);
     }

     // Mengukur waktu selesai sorting
     const endTime = performance.now();
     const timeTaken = endTime - startTime;

     // Memperbarui data asli
     updateOriginalData();
     document.getElementById('sort-button').disabled = false;
     document.getElementById('sort-select').disabled = false;
     document.getElementById('num-records-select').disabled = false;
     document.getElementById('order-select').disabled = false;
     reverseTable(); // Membalik tabel setelah sorting selesai

     // Menampilkan waktu sorting menggunakan SweetAlert
     Swal.fire({
         title: 'Sorting Complete',
         text: `Sorting took ${timeTaken.toFixed(2)} milliseconds.`,
         icon: 'success',
         confirmButtonText: 'OK'
     });
 }

 // Fungsi untuk memuat data awal tanpa sorting
 function loadInitialData() {
     const sortBy = document.getElementById('sort-select').value;
     const numRecords = parseInt(document.getElementById('num-records-select').value);

     let limitedArray = array.slice(0, numRecords);
     createChart(limitedArray, `${sortBy}_value`);
     updateTable(limitedArray);
 }

 // Fungsi untuk memperbarui tabel dengan data yang telah diurutkan
 function updateTable(sortedArray) {
     const dataTable = document.getElementById('data-table').getElementsByTagName('tbody')[0];
     dataTable.innerHTML = '';
     sortedArray.forEach(item => {
         const row = document.createElement('tr');
         const rankCell = document.createElement('td');
         const nameCell = document.createElement('td');
         const marketCapCell = document.createElement('td');
         const priceCell = document.createElement('td');
         const changeTodayCell = document.createElement('td');
         const countryCell = document.createElement('td');

         rankCell.textContent = item.rank;
         nameCell.textContent = item.name;
         marketCapCell.textContent = item.market_cap;
         priceCell.textContent = item.price;
         changeTodayCell.textContent = item.change_today;
         countryCell.textContent = item.country;

         row.appendChild(rankCell);
         row.appendChild(nameCell);
         row.appendChild(marketCapCell);
         row.appendChild(priceCell);
         row.appendChild(changeTodayCell);
         row.appendChild(countryCell);

         dataTable.appendChild(row);
     });
 }

 // Fungsi untuk memperbarui chart dengan data yang diurutkan
 async function updateChart(arr, key) {
     const labels = arr.map(d => d.name);
     const values = arr.map(d => d[key]);

     chart.data.labels = labels;
     chart.data.datasets[0].data = values;
     chart.update();
     await new Promise(resolve => setTimeout(resolve, 100)); // Membuat delay untuk animasi
 }

 // Fungsi untuk mengurutkan tabel berdasarkan urutan yang dipilih
 function orderTable() {
     const orderBy = document.getElementById('order-select').value;
     array.sort((a, b) => {
         if (orderBy === 'ascending') {
             return a.sort_value - b.sort_value;
         } else {
             return b.sort_value - a.sort_value;
         }
     });
     const numRecords = parseInt(document.getElementById('num-records-select').value);
     updateTable(array.slice(0, numRecords));
     createChart(array.slice(0, numRecords), `${document.getElementById('sort-select').value}_value`);
 }

 // Fungsi untuk memperbarui data asli dengan data yang diurutkan
 function updateOriginalData() {
     array.forEach((item, index) => {
         rawData[item.index] = item;
     });
 }

 // Fungsi untuk membalik urutan tabel
 function reverseTable() {
     const dataTable = document.getElementById('data-table').getElementsByTagName('tbody')[0];
     const rows = Array.from(dataTable.rows);
     dataTable.innerHTML = '';
     rows.reverse().forEach(row => dataTable.appendChild(row));
 }

 // Memuat data awal ketika halaman dimuat
 document.addEventListener('DOMContentLoaded', () => {
     loadInitialData();
 });
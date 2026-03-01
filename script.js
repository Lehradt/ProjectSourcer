window.onload = () => {
                 const inputs = document.querySelectorAll('.input');
                 const output = document.getElementById('output');
                 const lastViewedDisplay = document.getElementById('lastViewed');
                 const iframe = document.querySelector('.iframe');
                 const editArea = document.getElementById('editSource');
                 const editedStatus = document.getElementById('edited');
                 const generateSource = () => {
                     const url = document.querySelector('.url-input').value;
                     const title = document.querySelector('.title-input').value || "[TITEL UNBEKANNT]";
                     const author = document.querySelector('.author-input').value || "O.A.";
                     const date = new Date().toLocaleDateString('de-DE', { 
                         day: '2-digit', 
                         month: '2-digit', 
                         year: 'numeric' 
                     });

                     let website = "WEBSITE";
                     try {
                         if (url) {
                             const urlObj = new URL(url);
                             website = `${urlObj.protocol}//${urlObj.hostname}/`;
                             if (website) {
                               document.getElementById("website").innerText = website;
                             }
                         }
                     } catch (e) { website = "URL UNGÜLTIG"; }
                     if (url) {
                         const sourceString = `${author}: "${title}", in: ${website}, URL: ${url} [Letzter Zugriff: ${date}]`;
                         output.textContent = sourceString;
                         editArea.value = sourceString;
                         lastViewedDisplay.textContent = date;
                         lastViewedDisplay.classList.remove('none');
                         editedStatus.classList.add('none');
                         iframe.src = url;
                     }
                 };
                editArea.addEventListener('input', () => {
                     if (editArea.value !== output.textContent) {
                         editedStatus.textContent = "Geändert";
                         editedStatus.classList.remove('none');
                     } else {
                         editedStatus.classList.add('none');
                     }
                 });
                 inputs.forEach(input => input.addEventListener('input', generateSource));
                 document.getElementById('copySource').addEventListener('click', () => {
                     editArea.select();
                     document.execCommand('copy');
                     alert("Kopiert!")
                     editedStatus.classList.remove('none');
                 });
             }

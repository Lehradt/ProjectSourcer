window.onload = () => {
    const inputs = document.querySelectorAll('.input');
    const output = document.getElementById('output');
    const lastViewedDisplay = document.getElementById('lastViewed');
    const iframe = document.querySelector('.iframe');
    const editArea = document.getElementById('editSource');
    const editedStatus = document.getElementById('edited');
    const urlInput = document.querySelector('.url-input');
    const fetchMetadata = async (url) => {
        let checkUrl = url;
        if (checkUrl && !checkUrl.startsWith('http')) {
            checkUrl = 'https://' + checkUrl;
        }
        if (!checkUrl || !checkUrl.startsWith('http')) return;      
        try {
            const response = await fetch(`https://microlink.io{encodeURIComponent(checkUrl)}`);
            const result = await response.json();
            if (result.status === 'success') {
                const data = result.data;
                const titleField = document.querySelector('.title-input');
                const authorField = document.querySelector('.author-input');
                if (data.title && !titleField.value) titleField.value = data.title;
                if (data.author && !authorField.value) authorField.value = data.author;
                generateSource();
            }
        } catch (error) {
            console.warn("Metadata could not be loaded:", error);
        }
    };
    const generateSource = () => {
        let url = urlInput.value.trim();
        if (url && !url.match(/^[a-zA-Z]+:\/\//)) {
            url = 'https://' + url;
            urlInput.value = url;
        }
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
                let hostname = urlObj.hostname.replace(/^www\./, '');
                let parts = hostname.split('.');   
                if (parts.length > 2) {
                    const isShortTLD = parts[parts.length - 2].length <= 3;
                    parts = isShortTLD ? parts.slice(-3) : parts.slice(-2);
                }    
                let siteName = parts[0];
                website = siteName.charAt(0).toUpperCase() + siteName.slice(1);
                document.getElementById("website").innerText = website;
                document.getElementById("website").classList.remove('none');
            }
        } catch (e) { 
            website = "URL UNGÜLTIG"; 
        }
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
            editedStatus.textContent = "You changed the source.";
            editedStatus.classList.remove('none');
        } else {
            editedStatus.classList.add('none');
        }
    });
    inputs.forEach(input => input.addEventListener('input', generateSource));

    urlInput.addEventListener('change', () => {
        fetchMetadata(urlInput.value);
    });
    document.getElementById('copySource').addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(editArea.value);
            alert("Copied!");
            editedStatus.classList.remove('none');
        } catch (err) {
            console.error('Error while copying: ', err);     
            editArea.select();
            document.execCommand('copy');
        }
    });
}

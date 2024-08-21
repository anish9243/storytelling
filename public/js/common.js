document.getElementById('generateStory').addEventListener('click', async () => {
    const text = document.getElementById('storyText').value;

    const ttsResponse = await fetch('/tts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
    });
    const ttsAudio = await ttsResponse.text();
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.querySelector('source').src = ttsAudio;
    audioPlayer.load();

    const musicResponse = await fetch('/background-music?type=jungle');
    const musicData = await musicResponse.json();
    const musicPlayer = document.getElementById('musicPlayer');
    if (musicData.track) {
        musicPlayer.querySelector('source').src = musicData.track;
        musicPlayer.load();
        musicPlayer.volume = 0.2;
    } else {
        alert('No background music available');
    }

    audioPlayer.addEventListener('play', () => {
        musicPlayer.play();
    });
    audioPlayer.addEventListener('pause', () => {
        musicPlayer.pause();
    });
});

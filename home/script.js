const url_params = window.location.search
const params = new URLSearchParams(url_params)
const display = document.getElementById("videos")

const addVideo = (video) => {
	const videoElement = document.createElement("div")
	videoElement.classList.add("video")
	videoElement.innerHTML = `
	<div class="container">
		<a href="/InfoTube/watch?id=${video.videoId}" class="thumbnail">
			<img src="${video.videoThumbnails[4].url}" alt="${video.title}">
		</a>
		<a href="/InfoTube/watch?id=${video.videoId}" class="title">${video.title}</a>
		<a class="uploader">
			<span>
				${video.author}
			</span>
			${video.authorVerified ? '<i class="fa-solid fa-circle-check"></i>' : ''}
		</a>
		<div class="views_date">
			${video.viewCountText} • ${video.publishedText}
		</div>
	</div>
	`
	display.appendChild(videoElement)
}

const searchVideos = (text) => {
	if (text != "") {
		fetch(`${url}/api/v1/search?q=${text}?sort_by=relevance?type=video`)
		.then(res => res.json())
		.then(data => {
			display.innerHTML = ""
			data.forEach(video => addVideo(video))
		})
	}
}

const getTrending = () => {
	fetch(`${url}/api/v1/trending`)
	.then(res => res.json())
	.then(data => {
		display.innerHTML = ""
		data.forEach(video => addVideo(video))
	})
}

if (params.has("search") && params.get("search") != "") {
	searchVideos(params.get("search"))
} else {
	getTrending()
}


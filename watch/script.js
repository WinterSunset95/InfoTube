const url_params = window.location.search
const params = new URLSearchParams(url_params)

const video = document.getElementById("video")
const video_info = document.getElementById("video_info")
const comments_display = document.getElementById("comments")
const replies_display = document.getElementById("replies")
const recommended_display = document.getElementById("recommended")

let description_on = false;

// First check if the video id is valid
if (!params.has("id") || params.get("id") == "") {
	window.location.href = "/"
}

const toggleDescription = () => {
	const description = document.getElementById("description")
	const toggleButton = document.getElementById("toggleButton")
	description.classList.toggle("height_0")
	description_on = !description_on
	if (description_on) {
		toggleButton.innerHTML = "...less"
	} else {
		toggleButton.innerHTML = "...more"
	}
}

const addComments = (comments) => {
	console.log(comments)
	comments.forEach((comment) => {
		const div = document.createElement("div")
		div.classList.add("comment")
		div.innerHTML = `
			<div class="comment_name">
				<div class="comment_name_name">
					<img src="${comment.authorThumbnails[0].url}" alt="">
					<span>${comment.author}</span>
					${comment.verified ? '<i class="fa-solid fa-circle-check"></i>' : ""}
					<span>${comment.publishedText}</span>
				</div>
				${comment.isPinned ? '<i class="fa-solid fa-thumbtack"></i>' : ""}
			</div>
			<div class="comment_content">
				${comment.contentHtml}
			</div>
			<div class="comment_footer">
				<div class="comment_footer_likes">
					<i class="fa-solid fa-thumbs-up"></i>
					<span>${comment.likeCount}</span>
				</div>
				<div class="comment_footer_replies">
					${comment.replies ? comment.replies.replyCount : ""} ${comment.replies ? "replies" : ""}
				</div>
			</div>
		`
		comments_display.appendChild(div)
	})
}

const addInfo = (info) => {
	console.log(info)
	const div = document.createElement("div")
	div.classList.add("video_info")
	div.innerHTML = `
		<div class="title">
			${info.title}
		</div>
		<div class="views_more">
			${info.viewCount} views • ${info.publishedText} <button onclick="toggleDescription()" id="toggleButton">...more</button>
		</div>
		<div class="description height_0" id="description">
			${info.descriptionHtml}
		</div>
		<div class="author">
			<div class="flex">
				<div class="author_name">
					<img src="${info.authorThumbnails[0].url}" alt="">
					<span>${info.author}</span>
					<span class="author_sub_count">${info.subCountText}</span>
				</div>
				<div class="subscribe">
					Subscribe
				</div>
			</div>
		</div>
		<div class="likes_and_download">
			<div>
				<i class="fa-solid fa-thumbs-up"></i>
				<span>${info.likeCount}</span>
				<i class="fa fa-thumbs-down"></i>
			</div>
			<div>
				<i class="fa-solid fa-share"></i>
				<span>Share</span>
			</div>
			<a target="blank" href="${url}/latest_version?id=${params.get("id")}" download="video_download.mp4">
				<i class="fa-solid fa-download"></i>
				<span>Download</span>
			</a>
		</div>
	`
	video_info.appendChild(div)
}

const addRecommended = (videos) => {
	videos.forEach((video) => {
		console.log(video)
		const div = document.createElement("div")
		div.classList.add("recommended_video")
		div.innerHTML = `
		<div class="container">
			<a href="/InfoTube/watch?id=${video.videoId}" class="thumbnail">
				<img src="${video.videoThumbnails[5].url}" alt="">
			</a>
			<div class="video_data">
				<a href="/InfoTube/watch?id=${video.videoId}" class="recommended_video_title">
					${video.title}
				</a>
				<div class="recommended_video_author">
					${video.author} • ${video.viewCountText}
				</div>
			</div>
		</div>
		`
		recommended_display.appendChild(div)
	})
}

// Get and display the video
if (params.has("id") && params.get("id") != "") {
	const vid = document.createElement("video")
	vid.src = `${url}/latest_version?id=${params.get("id")}`
	vid.controls = true
	video.appendChild(vid)
}

// Get and display video information and recommended videos
if (params.has("id") && params.get("id") != "") {
	fetch(`${url}/api/v1/videos/${params.get("id")}`)
		.then((res) => res.json())
		.then((data) => {
			addInfo(data)
			addRecommended(data.recommendedVideos)
		})
}

// Get and display comments
if (params.has("id") && params.get("id") != "") {
	fetch(`${url}/api/v1/comments/${params.get("id")}`)
		.then((res) => res.json())
		.then((data) => addComments(data.comments))
}

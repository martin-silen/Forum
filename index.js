/*
	import data from separate file (?)
*/
import { commentsData } from "./data.js"
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'
import { setCookie, timeAgo } from "./utils.js"

if(!JSON.parse(localStorage.getItem('data'))){
    localStorage.setItem('data', JSON.stringify(commentsData))
}

/*
	function for handleing all clicks on the page, i.e. like, reply, 
*/
document.addEventListener('click', function(e){

	if(e.target.dataset.like){
		handleLikeClick(e.target.dataset.like) 
	} 
	else if(e.target.dataset.unlike){
        handleUnlikeClick(e.target.dataset.unlike)
    } 
	else if (e.target.dataset.reply){
		handleReplyClick(e.target.dataset.reply)
	}
	else if(e.target.id === 'comment-btn'){
        handleCommentBtnClick()
    }
	else if (e.target.dataset.edit){
		handleEditClick(e.target.dataset.edit)
	}
})

function getUser() {
	document.getElementById('usernameBtn').addEventListener('click', function(e){
		const usernameInput = document.getElementById('username-input')
		const element = document.getElementById('usernameBtn')
		const helloUser = document.getElementById('helloUser')

		usernameInput.classList.add('hidden')
		element.classList.add('hidden')
		helloUser.classList.remove('hidden')

		helloUser.innerHTML = `Hello ${usernameInput.value}`
	})
}

function handleLikeClick(commentId) {
	let data = JSON.parse(localStorage.getItem('data'))
	const targetCommentObj = data.filter(function(comment){
		return comment.uuid === commentId
	})[0]

	if(targetCommentObj.isLiked) {
		targetCommentObj.likes--
	} 
	else {
		targetCommentObj.likes++
	}
	targetCommentObj.isLiked = !targetCommentObj.isLiked
	localStorage.setItem("data", JSON.stringify(data))
	render()
	console.log(commentId)
}

function handleUnlikeClick(commentId) {
	let data = JSON.parse(localStorage.getItem('data'))
	const targetCommentObj = data.filter(function(comment){
		return comment.uuid === commentId
	})[0]

	if(targetCommentObj.isUnliked){
		targetCommentObj.unlike--
	} 
	else {
		targetCommentObj.unlike++
	}
	targetCommentObj.isUnliked = !targetCommentObj.isUnliked
	localStorage.setItem("data", JSON.stringify(data))
	render()
}

function handleReplyClick(replyId) {
	let helloUser = document.getElementById('username-input')
	document.getElementById(`replies-${replyId}`)
	let data = JSON.parse(localStorage.getItem('data'))
	let replyInputUser = document.getElementById(`reply-username-input-${replyId}`).value
	let replyInput = document.getElementById(`reply-text-${replyId}`).value
	if (replyInput) {
		const targetCommentObj = data.filter(comment =>
			comment.uuid === replyId)[0]
			targetCommentObj.replies.unshift(
				{
					handle: replyInputUser.value ? helloUser.value : 'Visitor123',
					commentText: replyInput
				}
			)
		replyInput = ''
		localStorage.setItem('data', JSON.stringify(data))
		render()
		handleReplyClick(replyId)
	}
}

function handleEditClick(editId) {
	document.getElementById(`comment-${editId}`)
	document.getElementById('edited')

	let data = JSON.parse(localStorage.getItem('data'))

	const targetCommentObj = data.filter(function (comment) {
		return comment.uuid === editId
	})[0]

	targetCommentObj.commentText = prompt('Edit your tweet')
	targetCommentObj.commentText += ` (edited)`

	console.log(targetCommentObj.commentText)

	localStorage.setItem('data', JSON.stringify(data))
	render()
}


function handleCommentBtnClick() {
	const usernameInput = document.getElementById('username-input')
	const commentInput = document.getElementById('comment-input')

	let data = JSON.parse(localStorage.getItem('data'))
	
    if(commentInput.value){
		data.unshift({
            handle: usernameInput.value ? usernameInput.value : 'Visitor123',
            likes: 0,
            unlike: 0,
            commentText: commentInput.value,
            replies: [],
            isLiked: false,
            isUnliked: false,
            uuid: uuidv4(),
			date: timeAgo(new Date()),
    	})
		localStorage.setItem('data', JSON.stringify(data))
		render()
		commentInput.value = ''
		usernameInput.value = ''
    }
}


function getFeedHtml(){
	let data = JSON.parse(localStorage.getItem('data'))
    let feedHtml = ``
    
    data.forEach(function(comment){
        
        let likeIconClass = ''
        if (comment.isLiked){
            likeIconClass = 'liked'
        }
        
        let unlikeIconClass = ''
        if (comment.isUnliked){
            unlikeIconClass = 'unliked'
        }
		
        let repliesHtml = ''
        
        if(comment.replies.length > 0){
            comment.replies.forEach(function(reply){
                repliesHtml+=`
					<div class="comment-inner">
						<div class="reply">
							<p class="handle">${reply.handle}</p>
							<p class="comment-text">${reply.commentText}</p>
						</div>
					</div>`
            })
        }

		let editHtml = ''

		editHtml += `

		`
          
        feedHtml += `
			<div class="feed">
				<div class="container">
						<div class = "info">
							<p class="handle">${comment.handle}</p>
							<p class="date">${comment.date}</p>
						</div>
						<div class="comment-text">
							<p id="comment-${comment.uuid}" class="comment-text">${comment.commentText}<span id="edited" ></span></p>
						</div>
						<div class="icons">
							<span class="icons">
							<i class="fa-solid fa-thumbs-up ${likeIconClass}"
							data-like="${comment.uuid}"
							></i>${comment.likes}
							</span>
							<span class="icons">
							<i class="fa-solid fa-thumbs-down ${unlikeIconClass}"
							data-unlike="${comment.uuid}"
							></i>${comment.unlike}
							</span>
							<span class="icons">
							<i class="fa-solid fa-edit"
							data-edit="${comment.uuid}"
							></i>
							</span>
						</div>              
				</div>
				<div id="replies-${comment.uuid}">
        				<div class="comment-reply">
							${repliesHtml}
							<input class="comment-set-username" type="text" placeholder="Set a username" id="reply-username-input-${comment.uuid}">
							<textarea id="reply-text-${comment.uuid}" placeholder="Type your comment here..."></textarea>
							<button id="reply-btn" class="reply-btn" data-reply="${comment.uuid}">Reply</button>
      					</div>
     				</dv>
				</div>   
			</div>
			`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

getUser()
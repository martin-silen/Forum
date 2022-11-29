import { commentsData } from "./data.js"
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'
import { timeAgo, getUser } from "./utils.js"

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

function handleLikeClick(commentId) {
	let data = JSON.parse(localStorage.getItem('data'))
	const targetCommentObj = data.filter(function(comment){
		return comment.uuid === commentId
	})[0]

	if(targetCommentObj.isLiked) {
		targetCommentObj.likes--
	} 
	else if(targetCommentObj.isUnliked){
		targetCommentObj.likes++
		targetCommentObj.unlike--
		targetCommentObj.isUnliked = false
	} else {
		targetCommentObj.likes++
	}
	targetCommentObj.isLiked = !targetCommentObj.isLiked
	localStorage.setItem("data", JSON.stringify(data))
	render()
}

function handleUnlikeClick(commentId) {
	let data = JSON.parse(localStorage.getItem('data'))
	const targetCommentObj = data.filter(function(comment){
		return comment.uuid === commentId
	})[0]

	if(targetCommentObj.isUnliked){
		targetCommentObj.unlike--
	} 
	else if(targetCommentObj.isLiked){
		targetCommentObj.unlike++
		targetCommentObj.likes--
		targetCommentObj.isLiked = false
	} else {
		targetCommentObj.unlike++
	}
	targetCommentObj.isUnliked = !targetCommentObj.isUnliked
	localStorage.setItem("data", JSON.stringify(data))
	render()
}

function handleReplyClick(replyId) {
	let user = JSON.parse(localStorage.getItem('userName'))
	let data = JSON.parse(localStorage.getItem('data'))
	document.getElementById(`replies-${replyId}`)
	let replyInput = document.getElementById(`reply-text-${replyId}`).value
	if (replyInput && user) {
		const targetCommentObj = data.filter(comment =>
			comment.uuid === replyId)[0]
			targetCommentObj.replies.unshift(
				{
					handle: user,
					commentText: replyInput,
					date: timeAgo(new Date()),
				}
			)
		replyInput = ''
		localStorage.setItem('data', JSON.stringify(data))
	} else {
		alert('Please set a username or write a reply')
		replyInput = ''
		render()
	}
	render()
}

function handleEditClick(editId) {
	document.getElementById(`comment-${editId}`)
	document.getElementById('edited')

	let data = JSON.parse(localStorage.getItem('data'))

	const targetCommentObj = data.filter(function (comment) {
		return comment.uuid === editId
	})[0]

	targetCommentObj.commentText = prompt('Edit your comment')
	targetCommentObj.commentText += ` (edited)`

	localStorage.setItem('data', JSON.stringify(data))
	render()
}


function handleCommentBtnClick() {
	const usernameInput = JSON.parse(localStorage.getItem('userName'))
	let data = JSON.parse(localStorage.getItem('data'))
	const commentInput = document.getElementById('comment-input')
	
    if(commentInput.value && usernameInput){
		data.unshift({
            handle: usernameInput,
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
    } else {
		alert('Please set a username')
		commentInput.value = ''
	}
}


function getFeedHtml(){
	let data = JSON.parse(localStorage.getItem('data'))
    let feedHtml = ``
    getUser()
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
							<div class="info">
								<p class="handle">${reply.handle},</p>
								<p class="date">${reply.date}</p>
							</div>
							<p class="comment-text">${reply.commentText}</p>
						</div>
					</div>`
            })
        }

        feedHtml += `
			<div class="feed">
				<div class="container">
						<div class = "info">
							<p class="handle">${comment.handle},</p>
							<p class="date">${comment.date}</p>
						</div>
						<div class="comment-text">
							<p id="comment-${comment.uuid}">${comment.commentText}</p>
						</div>
						<div class="icons">
							<span class="icon-info">
							<i class="fa-solid fa-thumbs-up ${likeIconClass}"
							data-like="${comment.uuid}"
							></i> ${comment.likes}
							</span>
							<span class="icon-info">
							<i class="fa-solid fa-thumbs-down ${unlikeIconClass}"
							data-unlike="${comment.uuid}"
							></i> ${comment.unlike}
							</span>
							<span class="icon-info">
							<i class="fa-solid fa-edit"
							data-edit="${comment.uuid}"
							></i> edit
							</span>
						</div>              
				</div>
				<div id="replies-${comment.uuid}">
        				<div class="comment-reply">
							${repliesHtml}
							<div class="reply-field">
								<textarea id="reply-text-${comment.uuid}" placeholder="Type your reply here..."></textarea>
								<button id="reply-btn" class="reply-btn" data-reply="${comment.uuid}">Reply</button>
							</div>
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

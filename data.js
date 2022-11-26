
export const commentsData = [   
    {
        handle: `John Doe`,
        likes: 2,
        unlike: 4,
        commentText: `The Christmas is coming. 
            Hopefully I will see the Santa Claus!!`,
        replies: [],
        isLiked: false,
        isUnliked: false,
        uuid: '4b161eee-c0f5-4545-9c4b-8562944223ee',
        date: 'Today at 10:21'
    },    
    {
        handle: `Elon Musk`,
        likes: 6500,
        unlike: 234,
        commentText: `I need volunteers for a one-way mission to Mars 🪐. No experience necessary🚀`,
        replies: [
                  {
                handle: `TomCruise`,
                commentText: `Yes! Sign me up! 😎🛩`,
                date: "23 November at 22:01"
            },
                  {
                handle: `ChuckNorris`,
                commentText: `I went last year😴`,
                date: "Yesterday at 07:22"
            },
        ],
        isLiked: false,
        isUnliked: false,
        uuid: '3c23454ee-c0f5-9g9g-9c4b-77835tgs2',
        date: "10 January 2021 at 10:45"
    },    
]
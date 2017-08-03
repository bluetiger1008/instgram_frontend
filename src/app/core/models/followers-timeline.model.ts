export class FollowersTimeline {
    timestamp: string;
    num_followers: number;
    event: {
        pic_link: string,
        num_likes: number
    };

    constructor() {
        this.timestamp = '';
        this.num_followers = 0;
        this.event = {
            pic_link: '',
            num_likes: 0
        };
    }
}

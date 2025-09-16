class TimeToNextTile extends ClockTile {

    getTimeString() {
        let now = new Date();
        let next = new Date(now);
        next.setDate(27);
        next.setHours(0,0,0,0);
        if (now.getDate() >= 27) {
            next = new Date(now.getFullYear() + Math.floor(now.getMonth()+1/12), (now.getMonth()+1)%13, 27) 
        }
        let dt = (next-now) / 1000;
        let days = Math.floor(dt/(60*60*24))
        let hours = Math.floor((dt%(60*60*24))/(60*60))
        let minutes = Math.floor((dt%(60*60))/60)
        let seconds = Math.floor(dt%60)
        return `Time to next 27. :\n${days.toString().padStart(2, "0")}:${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }

}

customElements.define("time-to-next-date", TimeToNextTile)
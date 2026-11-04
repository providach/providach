export function consultationTimeError(date:string,time:string,now=Date.now()):string|null{
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return 'Please check your preferred date.';
 if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))return 'Please check your preferred time.';
 const scheduled=Date.parse(`${date}T${time}:00+01:00`);
 if(!Number.isFinite(scheduled)||new Date(scheduled+3600000).toISOString().slice(0,10)!==date)return 'Please check your preferred date.';
 if(scheduled<=now)return 'Please check your preferred date and time. Choose a time in the future (West Africa Time).';
 return null;
}

import { get, writable } from 'svelte/store';
import { persisted } from 'svelte-persisted-store'
import { proxied } from 'svelte-proxied-store';
// import { persistent } from "@furudean/svelte-persistent-store"

export const progress = writable(54); // song progress
export const color = writable("#3e66ff"); // bg color
export const userColor = writable("#5F6074"); // bg color
export const isLooping = writable(true); // Set the initial value to true for looping
export const lyricIndex = writable(0); // current verse 
export const searchIndex = writable("");
export const playingStatus = writable(true);
export const focus = writable(false)
export const lyrics = writable(["Welcome to Lyricord!", "Open the settings on your top right to login", "Search for the song you wanna play on the search field below", "Let's get this party started!"])
export const inputMode = writable(true)

// export const config = persistent({
// 	start_value:{
//     speed: 0,
//     lyricEnd: "",
//     token: "",
//   },
// 	key: "config", // key to save as in Storage
// 	storage_type: "localStorage" // Storage object to use
// })

export const config = persisted('config', {
    speed: 0,
    lyricEnd: "",
    token: "",
  })
  
export const changesDetected = writable({
    isChanged: false,
    isInvalid: false,
    changes: get(config)
});
export const songDetails = writable({
    cover: {
        url: "",
},
    title: "",
    artist: "",
    url: ""
});
export const userDetails = writable({
    id: '',
    username: '',
    avatar: '',
    discriminator: '',
    public_flags: 0,
    premium_type: 0,
    flags: 0,
    banner: null,
    accent_color: 0,
    global_name: '',
    avatar_decoration_data: null,
    banner_color: '',
    mfa_enabled: false,
    locale: '',
    email: '',
    verified: false,
    phone: null,
    nsfw_allowed: false,
    linked_users: [],
    purchased_flags: 0,
    bio: '',
    authenticator_types: []
  });

// Welcome to Lyricord!
// Type your song lyrics down below
// Let's get this party started!

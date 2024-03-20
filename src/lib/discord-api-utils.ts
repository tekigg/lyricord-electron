// api-utils.ts
const baseApiUrl = 'https://discord.com/api/v9';
// Define types for the responses

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Content-Type': 'application/json',
    Authorization: ''
  }

  interface UserSettings {
    locale: string;
    show_current_game: boolean;
    restricted_guilds: string[];
    default_guilds_restricted: boolean;
    inline_attachment_media: boolean;
    inline_embed_media: boolean;
    gif_auto_play: boolean;
    render_embeds: boolean;
    render_reactions: boolean;
    animate_emoji: boolean;
    enable_tts_command: boolean;
    message_display_compact: boolean;
    convert_emoticons: boolean;
    explicit_content_filter: number;
    disable_games_tab: boolean;
    theme: string;
    developer_mode: boolean;
    detect_platform_accounts: boolean;
    status: string;
    afk_timeout: number;
    timezone_offset: number;
    stream_notifications_enabled: boolean;
    allow_accessibility_detection: boolean;
    contact_sync_enabled: boolean;
    native_phone_integration_enabled: boolean;
    animate_stickers: number;
    friend_discovery_flags: number;
    view_nsfw_guilds: boolean;
    view_nsfw_commands: boolean;
    passwordless: boolean;
    friend_source_flags: {
      all: boolean;
    };
    guild_folders: {
      guild_ids: string[];
      id: null;
      name: null;
      color: null;
    }[];
    custom_status: {
      text: string;
      expires_at: null;
      emoji_id: null;
      emoji_name: null;
    };
    activity_restricted_guild_ids: string[];
    activity_joining_restricted_guild_ids: string[];
    broadcast_allow_friends: boolean;
    broadcast_allowed_guild_ids: string[];
    broadcast_allowed_user_ids: string[];
  }
  

  interface User {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    public_flags: number;
    premium_type: number;
    flags: number;
    banner: null | string;
    accent_color: number;
    global_name: string;
    avatar_decoration_data: null | any; // You can replace 'any' with a more specific type if needed.
    banner_color: string;
    mfa_enabled: boolean;
    locale: string;
    email: string;
    verified: boolean;
    phone: null | string;
    nsfw_allowed: boolean;
    linked_users: any[]; // You can replace 'any' with a more specific type if needed.
    purchased_flags: number;
    bio: string;
    authenticator_types: number[];
  }
  

  interface LoginResponse {
    token: string;
    user: User;
  }
  
  // Function to set the authorization token in headers
  function setAuthorizationToken(token: string) {
    headers.Authorization = token;
  }
  
  // Function to make a login request and validate
  export async function loginAndValidate(token: string): Promise<LoginResponse> {
    try {
      // Set the authorization token in the headers
      setAuthorizationToken(token);
  
      const options = {
        method: 'GET',
        headers: headers,
      };
  
      const response = await fetch(`${baseApiUrl}/users/@me`, options);
      
      if (!response.ok) {
        throw new Error(`Login failed! HTTP error. Status: ${response.status}`);
      }
  
      const user: User = await response.json();
  
      return { token, user };
    } catch (error) {
      throw error;
    }
  }
    // Function to make a login request and validate
    export function updateStatus(text: string, token: string) {
        try {
          // Set the authorization token in the headers
          setAuthorizationToken(token);
      
          const options = {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify({
                    "custom_status": {
                        "text": text
                    }
            })
          };
      
          const response = fetch(`${baseApiUrl}/users/@me/settings`, options);
          console.log(options.body)

      
      
        } catch (error) {
          throw error;
        }
      }
  // Example usage:
  async function authenticateAndFetchUser(token: string) {
    try {
      const loginResponse = await loginAndValidate(token);
      console.log('Login successful');
      console.log('User:', loginResponse.user);
      return loginResponse;
    } catch (error) {
      console.error('Login failed');
      console.error(error);
      throw error;
    }
  }
  
  export { authenticateAndFetchUser };
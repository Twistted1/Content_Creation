export const youtubeService = {
  // We will use the Google Identity Services SDK (loaded in index.html or on demand)
  // to get the access token. This service assumes we have a valid token.

  async getChannelInfo(accessToken: string) {
    const response = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch channel info');
    }

    const data = await response.json();
    return data.items[0];
  },

  async uploadVideo(accessToken: string, file: File, title: string, description: string, privacyStatus: 'private' | 'public' | 'unlisted' = 'private') {
    const metadata = {
      snippet: {
        title,
        description,
        tags: ['ContentFlow', 'AI'],
        categoryId: '22' // People & Blogs
      },
      status: {
        privacyStatus
      }
    };

    const formData = new FormData();
    // The order matters! Metadata must be first part as JSON
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append('file', file);

    const response = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status&uploadType=multipart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Upload failed');
    }

    return await response.json();
  }
};

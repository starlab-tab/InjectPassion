import $https from '../https.js'

export const getPlatforms = (data) => {
  return $https({
    url: 'get_platforms',
    data
  })
}

export const getPlatformApi = (data) => {
  return $https({
    url: 'get_platform_api',
    data
  })
}

export const getTabs = (data) => {
  return $https({
    url: 'get_tabs',
    data
  })
}

export const getTabContent = (data) => {
  return $https({
    url: 'get_tab_content',
    data
  })
}

export const newTabContent = (data) => {
  return $https({
    url: 'new_tab_content',
    data
  })
}

export const getArticles = (data) => {
  return $https({
    url: 'get_articles',
    data
  })
}

export const addAuthor = (data) => {
  return $https({
    url: 'add_author',
    data
  })
}

export const getAuthors = (data) => {
  return $https({
    url: 'get_authors',
    data
  })
}

export const tapCollect = (data) => {
  return $https({
    url: 'tap_collect',
    data
  })
}

export const alsCollect = (data) => {
  return $https({
    url: 'als_collect',
    data
  })
}

export const getCollects = (data) => {
  return $https({
    url: 'get_collects',
    data
  })
}

export const getCollectIds = (data) => {
  return $https({
    url: 'get_collect_ids',
    data
  })
}

export const verfCollected = (data) => {
  return $https({
    url: 'verf_collected',
    data
  })
}

export const getCollectDetail = (data) => {
  return $https({
    url: 'get_collect_detail',
    data
  })
}

export const addComment = (data) => {
  return $https({
    url: 'add_comment',
    data
  })
}

export const getComment = (data) => {
  return $https({
    url: 'get_comment',
    data
  })
}

export const markTrace = (data) => {
  return $https({
    url: 'mark_trace',
    data
  })
}

export const getTraces = (data) => {
  return $https({
    url: 'get_traces',
    data
  })
}

export const eraseTraces = (data) => {
  return $https({
    url: 'erase_traces',
    data
  })
}
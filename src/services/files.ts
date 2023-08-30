import { request } from 'ice';

type Files = {
  id: string;
  name: string;
  size: number;
  createdAt: string
}

const ICE_API_FILES_PREFIX = process.env.ICE_API_FILES_PREFIX ?? '/api-files'

/**
 * 上传
 * @param data
 * @returns
 */
export async function updateFiles(data: {
  key: string;
  bucket: string;
  file: File;
}) {
  const result = await request.post(`${ICE_API_FILES_PREFIX}/files`, data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  if (typeof result === 'string') {
    return result
  }
  return null
}


/**
 * 获取数据
 * @param fileId
 * @returns
 */
export async function getFiles(fileId: string) {
  if (fileId == '0') {
    return null;
  }
  const result = await request.get(`${ICE_API_FILES_PREFIX}/files/${fileId}`)
  if (result?.id) {
    return result as Files;
  }
  return null;
}

/**
 * 删除数据
 * @param fileId
 * @returns
 */
export async function delFiles(fileId: string) {
  if (fileId == '0') {
    return null;
  }
  const result = await request.delete(`${ICE_API_FILES_PREFIX}/files/${fileId}`)
  return result;
}



/**
 * 获取数据
 * @param fileId
 * @param type
 * @returns
 */
export async function getFilesRaw(fileId: string | number, type?: 'url') {
  if (fileId == '0') {
    return null;
  }
  const result = await request.get(`${ICE_API_FILES_PREFIX}/files/${fileId}/raw`, {
    responseType: "blob",
  })
  if (typeof result === 'object' && result.constructor.name === 'Blob') {
    if (type === 'url') {
      return URL.createObjectURL(result);
    } else {
      return result as Blob
    }
  }
  return null;
}



/**
 * 帮助数组快速获取数据
 * @param arr
 * @param key
 * @returns
 */
export async function formatArrayFilesRaw<T>(arr: T[], key: string, defaultValue?: any) {
  return await Promise.all(arr.map(async (item) => {
    if (item[key]) {
      item[key] = await getFilesRaw(item[key], 'url')
    } else {
      item[key] = defaultValue
    }
    return item
  }));
}



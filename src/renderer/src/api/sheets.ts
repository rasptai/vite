import axios from 'axios'

const url = 'http://localhost:8000'

// メインプロセスで実行するopenDialog関数に渡す引数の型定義
export type FileFilters = { name: string; extensions: string[] }
export type FilterKey = 'oasis' | 'exemplar' | 'combined'

// ここで定義したフィルターは、メインプロセスで実行するopenDialog関数に渡す引数として使用される
const filters: Record<FilterKey, FileFilters> = {
  oasis: { name: 'OASIS Table', extensions: ['xls','xlsx','xlsm'] },
  exemplar: { name: 'Exemplar Sample List', extensions: ['csv'] },
  combined: { name: 'ID & Conc File', extensions: ['csv'] }
}

// ファイルパスを取得する関数
export const getFilePath = async (filterKey: FilterKey) => {
  const path = await window.electronAPI.openDialog(filters[filterKey])
  return path
}

// oasis tableのシート名を取得する関数
export const getSheetNames = async (path1: string, path2?: string) => {
  // paramsの型定義を行い、path2が存在する場合はparamsに追加する
  const params: { table_path1: string; table_path2?: string } = { table_path1: path1 }
  if (path2 !== '') {
    params.table_path2 = path2
  }

  const res = await axios.get('http://localhost:8000/sheets/enum', { params })
  const sheetNames = res.data.map((sheetName: string) => ({ label: sheetName, value: sheetName }))
  return sheetNames
}

export const validateOasis = async (path: string) => {
  if (path) {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        axios.get(`${url}/sheets/validate/oasis`, { params: { path }})
          .then(() => {
            resolve()
          })
          .catch((error: any) => {
            if (error.response && error.response.status === 400) {
              reject(new Error(error.response.data.detail))
            } else {
              reject(new Error('バリデーション中に予期しないエラーが発生しました。'))
            }
          })
      }, 1000)
    })
  }
}

// exemplarをPythonに渡してバリデーションを行う関数
export const validateExemplar = async (_: any, path: string) => {
  if (path) {
    return new Promise<void>((resolve, reject) => {
      // 1秒の遅延を追加
      setTimeout(() => {
        axios.get(`${url}/sheets/validate/exemplar`, { params: { path }})
          .then(() => {
            resolve()
          })
          .catch((error: any) => {
            if (error.response && error.response.status === 400) {
              reject(new Error(error.response.data.detail));
            } else {
              reject(new Error('バリデーション中に予期しないエラーが発生しました。'))
            }
          })
      }, 1000)
    })
  }
}

export const validateCombined = async (_: any, path: string) => {
  if (path) {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        axios.get(`${url}/sheets/validate/combined`, { params: { path }})
          .then(() => {
            resolve()
          })
          .catch((error: any) => {
            if (error.response && error.response.status === 400) {
              reject(new Error(error.response.data.detail))
            } else {
              reject(new Error('バリデーション中に予期しないエラーが発生しました。'))
            }
          })
      }, 1000)
    })
  }
}
import { useState } from 'react'
import { Button, Input, Select, Form, Divider, Space, Checkbox, SelectProps, InputNumber, Modal } from 'antd'
import { FolderOpenOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { getFilePath, getSheetNames, validateExemplar, FilterKey, validateCombined } from '../api/sheets'

const { Search } = Input // InputコンポーネントからSearchコンポーネントを取り出す

const formValidateMessages = {
  required: true,
  message: '必須項目です。',
}

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}

function FormComponent(): JSX.Element {
  const [form] = Form.useForm()
  const [selectFormat, setSelectFormat] = useState<boolean>(false)
  const [isTable2Visible, setIsTable2Visible] = useState<boolean>(false)
  const [sheetNames, setSheetNames] = useState<SelectProps['options']>([])
  const [path1Status, setPath1Status] = useState<'success' | 'error' | 'validating' | undefined>(undefined)
  const [path2Status, setPath2Status] = useState<'success' | 'error' | 'validating' | undefined>(undefined)
  const [control, setControl] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  // Searchボタンを押すとファイルパスを取得し、フォームにセットする
  const handleFileSearch = async (name: string, filter: FilterKey) => {
    const path = await getFilePath(filter)
    if (path) {
      form.setFieldsValue({ [name]: path })
    }
  }

  const handleOasisSearch = async (name: string, filter: FilterKey) => {
    await handleFileSearch(name, filter)
    const sheets = await getSheetNames(form.getFieldValue('table1'), form.getFieldValue('table2')) // シート名を取得
    setSheetNames(sheets)
  }

  const onFinish = async (values: any) => {
    console.log(values)
    setIsModalOpen(true)
  }

  const onFinishFailed = (errorInfo: any) => {
    setIsModalOpen(true)
    console.log('Failed:', errorInfo)
  }

  return (
    <div className='form'>
      {/* フォームコンポーネント */}
      <Form
        name='form'
        form={form}
        requiredMark={false}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        {...formLayout}
      >
        <div>
          {selectFormat ? (
            <div>
              {/* output combined path */}
              <Form.Item
                name='combined'
                label='ID & Conc File Path'
                hasFeedback
                validateDebounce={1000}
                rules={[{ ...formValidateMessages }, { validator: validateCombined }]}
              >
                <Search
                  placeholder='ID & Conc File Path'
                  enterButton={<Button icon={<FolderOpenOutlined />} />}
                  onSearch={() =>
                    handleFileSearch('combined', 'combined').then(() => {
                      form.validateFields(['combined'])
                    })
                  }
                />
              </Form.Item>
            </div>
          ) : (
            <div>
              {/* OASIS Table Path1 */}
              <Form.Item
                name='table1'
                label='Table1 Path'
                hasFeedback
                help={path1Status === 'validating' ? 'シートを選択してください' : undefined}
                validateStatus={path1Status}
                validateDebounce={1000}
                rules={[{ ...formValidateMessages }]}
              >
                <Search
                  placeholder='OASIS Table1 Path'
                  enterButton={<Button icon={<FolderOpenOutlined />} />}
                  onSearch={() => handleOasisSearch('table1', 'oasis')}
                />
              </Form.Item>

              {/* OASIS Table Path2 */}
              {isTable2Visible && ( // 必須項目ではないため、＋ボタンを押すまで表示されない
                <Form.Item
                  name='table2'
                  label='Table2 Path'
                  hasFeedback
                  help={path2Status === 'validating' ? 'シートを選択してください' : undefined}
                  validateStatus={path2Status}
                  validateDebounce={1000}
                >
                  <Search
                    placeholder='OASIS Table2 Path'
                    enterButton={<Button icon={<FolderOpenOutlined />} />}
                    onSearch={() => handleOasisSearch('table2', 'oasis')}
                  />
                </Form.Item>
              )}

              {/* Visible Table2 ToggleButton */}
              <Form.Item wrapperCol={{ offset: 12 }}>
                <Button type='primary' shape='circle' onClick={() => setIsTable2Visible(!isTable2Visible)}>
                  {isTable2Visible ? <MinusOutlined /> : <PlusOutlined />}
                </Button>
              </Form.Item>

              {/* Exemplar Sample List Path */}
              <Form.Item
                name='exemplar'
                label='Exemplar Path'
                hasFeedback
                validateDebounce={1000}
                rules={[{ ...formValidateMessages }, { validator: validateExemplar }]}
              >
                <Search
                  placeholder='Exemplar Path'
                  enterButton={<Button icon={<FolderOpenOutlined />} />}
                  onSearch={() =>
                    handleFileSearch('exemplar', 'exemplar').then(() => {
                      form.validateFields(['exemplar'])
                    })
                  }
                />
              </Form.Item>

              {/* Select Sheet */}
              <Form.Item name='sheet' label='Select Sheet' rules={[{ ...formValidateMessages }]}>
                <Select style={{ width: '80%' }} options={sheetNames} />
              </Form.Item>
            </div>
          )}
        </div>

        <Form.Item wrapperCol={{ offset: 17 }}>
          <Button type='primary' onClick={() => setSelectFormat(!selectFormat)}>
            format change
          </Button>
        </Form.Item>
        <Divider />

        {/* Application */}
        <Form.Item name='application' label='Application' rules={[{ ...formValidateMessages }]}>
          <Select
            style={{ width: '60%' }}
            options={[
              { label: 'RNA-seq', value: 'Application1' },
              { label: 'WGS_20ng', value: 'Application2' },
              { label: 'WES_130ng', value: 'Application3' },
            ]}
          />
        </Form.Item>

        {/* Final Conc */}
        <Form.Item name='concentration' label='Final Conc' rules={[{ ...formValidateMessages }]}>
          <Space>
            <Input style={{ width: 50 }} />
            <Select
              style={{ width: 80 }}
              defaultValue={'ng/μL'}
              options={[
                { label: 'ng/μL', value: 'ng/μL' },
                { label: 'nM', value: 'nM' },
              ]}
            />
          </Space>
        </Form.Item>

        {/* Final Volume */}
        <Form.Item
          name='volume'
          label='Final Volume'
          rules={[{ ...formValidateMessages }, { type: 'number', min: 1, message: '1以上の数値を入力してください。' }]}
        >
          <InputNumber suffix='μL' style={{ width: 80 }} />
        </Form.Item>

        {/* Input Amount */}
        <Form.Item name='amount' label='Input Amount' rules={[{ ...formValidateMessages }]}>
          {/* ContとVolumeから自動計算する */}
          <Input
            variant='borderless'
            // readOnly={true}
            // onFocus={(e) => e.target.blur()}
            suffix='ng'
            style={{ width: 80 }}
          />
        </Form.Item>

        {/* Sample Usage */}
        <Form.Item name='usage' label='Sample Usage'>
          <Select
            style={{ width: 80 }}
            options={[
              { label: '1μL', value: 1 },
              { label: '2μL', value: 2 },
            ]}
          />
        </Form.Item>

        {/* Control */}
        <Form.Item name='control' label='Control Usage' valuePropName='checked'>
          <Checkbox checked={control} onChange={(e) => setControl(e.target.checked)} />
        </Form.Item>

        <Divider />

        <Form.Item>
          <Space>
            <Button type='primary' htmlType='submit'>
              Run
            </Button>
            <Button type='default' htmlType='reset'>
              Reset
            </Button>
            <Button type='default' onClick={() => setIsModalOpen(true)}>
              Test
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <Modal
        title='Result'
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      >
        <p></p>
      </Modal>
    </div>
  )
}

export default FormComponent

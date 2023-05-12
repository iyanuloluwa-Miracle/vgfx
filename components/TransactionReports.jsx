import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ExportZone from './ExportZone';
import {
  SearchIcon,
  FilterIcon,
  DirLeft,
  DirRight,
  CalenderIcon,
  BankDebit,
} from '../utility/svg';
import Link from 'next/link';
import {
  Button,
  Input,
  Select,
  Space,
  Checkbox,
  Table,
  Modal,
  Form,
  Radio,
  DatePicker,
  Skeleton,
} from 'antd';
import api from '../apis';
import { useQuery } from '@tanstack/react-query';
import secureLocalStorage from 'react-secure-storage';
import { useRouter } from 'next/router';
import moment from 'moment';

export default function TransactionReports() {
  const { Search } = Input;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalReport, setModalReport] = useState(false);
  const [modalsignature, setModalSignature] = useState(false);
  const [approval, setApproval] = useState(false);
  const [approvalModal, setApprovalModal] = useState(false);
  const [value, setValue] = useState('all');
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [reportDetails, setReportDetails] = useState(null);

  const [currentStatus, setCurrentStatus] = useState('Awaiting Confirmation');

  const defaultCheckedList = ['Pending'];
  const defaultCheckedList2 = ['All'];
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [checkedList2, setCheckedList2] = useState(defaultCheckedList2);
  const [checkAll, setCheckAll] = useState(false);
  const [checkAll2, setCheckAll2] = useState(false);
  const [transactionType, setTransactionType] = useState('');
  const [statusType, setStatusType] = useState('');

  const router = useRouter();

  const handleChange = value => {
    console.log(`selected ${value}`);
  };

  const onFinish = values => {
    console.log('Success:', values);
  };
  const onSearch = value => console.log(value);

  const onChangeCheck = e => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };
  const onChange = e => {
    console.log(`checked = ${e.target.checked}`);
  };

  const onChanges = checkedValues => {
    console.log('checked = ', checkedValues);
  };

  const [indeterminate, setIndeterminate] = useState(true);
  const [indeterminate2, setIndeterminate2] = useState(true);

  const options = [
    {
      label: 'All',
      value: 'All',
    },
    {
      label: 'Pending',
      value: 'Pending',
    },
    {
      label: 'On Tracking',
      value: 'On Tracking',
    },
    {
      label: 'Recovery',
      value: 'Recovery',
    },
    {
      label: 'Completed',
      value: 'Completed',
    },
  ];

  const plainOptions = [
    'Approved',
    'Awaiting Confirmation',
    'Declined',
    'Failed',
    'Processed',
    'Initiated',
  ];

  const transactionOptions = ['Bank debit', 'Wrong Transfer', 'Card Fraud'];

  const onChanged = e => {
    console.log('radio checked', e.target.value);
    setStatusType(e.target.value);
  };

  const onChanged2 = e => {
    console.log('radio checked', e.target.value);
    setTransactionType(e.target.value);
  };

  const columns = [
    {
      title: 'Tracking ID',
      dataIndex: 'trackID',
      key: 'trackID',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Transaction Type',
      dataIndex: 'transactionType',
      key: 'transactionType',
    },
    {
      title: 'Transaction Reference',
      dataIndex: 'referenceID',
      key: 'referenceID',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: text => <span className={`status ${text}`}>{text}</span>,
    },
    {
      title: 'Date Reported',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: ' ',
      dataIndex: 'details',
      key: 'details',
      // render: text => (
      //   <div className="view-btn">
      //     <Button className="view-profile" onClick={() => setModalReport(true)}>
      //       View details
      //     </Button>

      //     <Button
      //       className="view-report"
      //       onClick={() => setModalSignature(true)}
      //     >
      //       Signatures
      //     </Button>
      //   </div>
      // ),
    },
  ];

  const dataType = reportData?.map((el, index) => ({
    ...el,
    details: (
      <div className="view-btn">
        <Button
          className="view-profile"
          onClick={() => {
            setReportDetails(el);
            setModalReport(true);
          }}
        >
          View details
        </Button>

        <Button className="view-report" onClick={() => setModalSignature(true)}>
          Signatures
        </Button>
      </div>
    ),
  }));

  // const { data: getReport, isLoading: getReportLoading } = useQuery({
  //   queryKey: ['get_products'],
  //   queryFn: () => {
  //     return api.getReportHistory(token);
  //   },
  //   onSuccess: () => {},
  // });

  useEffect(() => {
    const getReports = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          'https://safe.staging.vigilant.ng/manage/api/v1.0/transaction_report_history?action=fetch',
          {
            Authorization: `Bearer ${JSON.parse(
              secureLocalStorage.getItem('Token')
            )}`,
            'x-api-key':
              '68457553374b4a676e2b574452596d4b4c3439724737707341434e3652423834466775463033674637624e636d526662614c6e697774646a394e42697473534e785878483852416d2b577551617434743453496137505664342b75776b546e5168313350653876343672666b4848674577626864792b77676b47734761356e456d59767632666b486b3342576a6e394945564364416d4f7a4e50576d5337726b4f443774617a662f7036616142784766685479655133696734446f6c684d6e6c4449377857486d794d6463614963497a386d755551474a7a417447367a34314b69456a4179516a79623262306a37477957332b74496f392f50393559505a6137537a62656e4d2b665a446644564957555872556351734d737269637651536746546b714f42656b674b61542f566165527346473031672b6f346238462f4c54694b6346514567354c682b5470566e65777770487553773d3d',
          }
        );

        console.log(res);
        if (
          res?.data?.code === 'EXP_000' ||
          res?.data?.code === 'EXP_001' ||
          res?.data?.code === 'EXP_002' ||
          res?.data?.code === 'EXP_003' ||
          res?.data?.code === 'EXP_004' ||
          res?.data?.code === 'EXP_005' ||
          res?.data?.code === 'EXP_006' ||
          res?.data?.code === 'EXP_007' ||
          res?.data?.code === 'EXP_008'
        ) {
          router.push('/');
          console.log('oyah nah');
        }

        setLoading(false);
        setReportData(res?.data?.response?.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getReports();
  }, [router]);

  console.log(reportDetails);

  return (
    <section>
      <ExportZone h4="All Transaction Reports" />

      <div className="container search-filter">
        <div className="row justify-content-between gap-3">
          <div className="col-md-auto d-flex flex-wrap gap-3 me-lg-5">
            <div className="the-search">
              <Search
                prefix={SearchIcon}
                placeholder="Search by name..."
                onSearch={onSearch}
                className="searching"
              />
            </div>
            <div className="filter-btn-wrapper">
              <Button icon={FilterIcon} onClick={() => setModalOpen(true)}>
                Filter by:
              </Button>
            </div>
          </div>
          <div className="col-md-auto d-flex justify-content-end gap-lg-5 gap-4">
            <div className="d-flex gap-lg-4 gap-3 align-items-center flex-wrap">
              <p className="det">
                Page <span className="our-color">2</span> of{' '}
                <span className="our-color">1000</span>
              </p>
              <div className="dir">
                <a href="">
                  <span className="">{DirLeft}</span>
                </a>
                <a href="">
                  <span className="">{DirRight}</span>
                </a>
              </div>
            </div>
            <div>
              <Space wrap>
                <Select
                  defaultValue="10 per page'"
                  style={{
                    width: 120,
                  }}
                  onChange={handleChange}
                  options={[
                    {
                      value: '10',
                      label: '10 per page',
                    },
                    {
                      value: '100',
                      label: '100 per page',
                    },
                    {
                      value: '1000',
                      label: '1000 per page',
                    },
                  ]}
                />
              </Space>
            </div>
          </div>
          <div className="select-all">
            {/* <Checkbox onChange={onChange}>Select All</Checkbox> */}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="table-wrapper ">
          {loading ? (
            <Skeleton active paragraph={{ rows: 12 }} />
          ) : (
            <Table columns={columns} dataSource={dataType} />
          )}

          <div className="our-pagination d-flex justify-content-center">
            <div className="d-flex gap-lg-4 gap-3 align-items-center flex-wrap">
              <p className="det">
                Page <span className="our-color">2</span> of{' '}
                <span className="our-color">1000</span>
              </p>
              <div className="dir">
                <a href="">
                  <span className="">{DirLeft}</span>
                </a>
                <a href="">
                  <span className="">{DirRight}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* notification modal  */}

      <Modal
        title={<div className="text-center">Report Details</div>}
        centered
        open={approvalModal}
        onOk={() => setApprovalModal(false)}
        className="our-modal report-modal"
        footer={null}
        onCancel={() => setApprovalModal(false)}
      >
        <div className="mt-5 pt-lg-1 mb-4 pb-1 d-flex justify-content-center">
          {approval ? (
            <Image
              src="/images/success.png"
              alt="approval"
              width={160}
              height={160}
            />
          ) : (
            <Image
              src="/images/remove.png"
              alt="approval"
              width={160}
              height={160}
            />
          )}
        </div>
        <p>
          {approval
            ? 'Transaction report processed successfully'
            : 'Transaction report declined successfully'}
        </p>

        <Form.Item className="buttons d-flex justify-content-center mb-4 pb-2">
          <Button
            onClick={() => setApprovalModal(false)}
            htmlType="submit"
            className="me-3"
            style={{ background: '#7D0003', color: '#fff' }}
          >
            Go to authorized reports
          </Button>
          <Button
            onClick={() => setApprovalModal(false)}
            style={{ background: '#FAEFF0', color: '#7D0003' }}
          >
            Go back to report details
          </Button>
        </Form.Item>
      </Modal>

      {/* view details modals  */}

      <Modal
        title={<div className="text-center">Report Details</div>}
        centered
        open={modalReport}
        onOk={() => setModalReport(false)}
        className="our-modal report-modal"
        footer={null}
        onCancel={() => setModalReport(false)}
      >
        <div className="report-details-modal border-bottom ">
          <h4 className="mb-4">Transaction Details</h4>
          <div className="row">
            <div className="col-md-4 col-6">
              <h6>
                Transaction date <span>{CalenderIcon}</span>{' '}
              </h6>
              <p>
                {moment(reportDetails?.transactionDate).format('Do MMM, YYYY')}
              </p>
            </div>
            <div className="col-md-4 col-6">
              <h6>Account number</h6>
              <p>{reportDetails?.accountNo}</p>
            </div>
            <div className="col-md-4 col-6">
              <h6>Transaction type</h6>
              <p>{reportDetails?.transactionType}</p>
            </div>
          </div>
          <div className="row ">
            <div className="col-md-4 col-6">
              <h6>Transaction reference</h6>
              <p>{reportDetails?.referenceID}</p>
            </div>
            <div className="col-md col-6">
              <h6>Bank Name</h6>
              <p>
                <span>
                  <Image
                    src={reportDetails?.bankLogoUrl}
                    alt="bank logo"
                    width={22}
                    height={22}
                  />
                </span>{' '}
                {reportDetails?.bankName}
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 col-6">
              <h6>Tracking ID </h6>
              <p>{reportDetails?.trackID}</p>
            </div>
            <div className="col-md col-6">
              <h6>
                Report date <span>{CalenderIcon}</span>{' '}
              </h6>
              <p>{moment(reportDetails?.createdAt).format('Do MMM, YYYY')}</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <h6>Reported by</h6>
              <p className="our-primary-color text-decoration-underline">
                {reportDetails?.names}
              </p>
            </div>
          </div>
        </div>

        <div className="report-details-modal pb-4">
          <div className="row">
            <div>
              <h4 className="bold">Tracking Details</h4>
            </div>
          </div>
          <div className="row">
            <h6>Report status</h6>
            <p className={`statuses ${reportDetails?.status}`}>
              • {reportDetails?.status}
            </p>
          </div>

          <div className="row notes">
            <h6>Notes</h6>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>

          <Form.Item className="buttons">
            <Button
              // type="primary"
              onClick={() => {
                setModalReport(false);
                setApproval(true);
                setApprovalModal(true);
              }}
              htmlType="submit"
              className="me-3"
              style={{ background: '#7D0003', color: '#fff' }}
            >
              Initiate Report
            </Button>
            <Button
              // type="primary"
              onClick={() => {
                setModalReport(false);
                setApproval(false);
                setApprovalModal(true);
              }}
              style={{ background: '#FAEFF0', color: '#7D0003' }}
            >
              Decline
            </Button>
          </Form.Item>
        </div>
      </Modal>

      {/* signature modal  */}

      <Modal
        title={<div className="text-center">Signatures</div>}
        centered
        open={modalsignature}
        onOk={() => setModalSignature(false)}
        className="our-modal report-modal"
        footer={null}
        onCancel={() => setModalSignature(false)}
      >
        <div className="report-details-modal signature-modal">
          <div className="separation">
            <h4>Processing Details</h4>

            <div className="row">
              <div className="col-sm-6 col-6">
                <h6>Processing Details</h6>
                <p>Atanda Specter</p>
              </div>
              <div className="col-sm-6 col-6">
                <h6>
                  Process date <span className="ms-1">{CalenderIcon}</span>
                </h6>
                <p>Jan 11th, 2022 15:20</p>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <h6>
                  Report date to Process Interval{' '}
                  <span className="ms-1">{CalenderIcon}</span>
                </h6>
                <p>1 year : 4months : 100 days : 15hrs : 40mins : 23 secs</p>
              </div>
            </div>
          </div>

          <div className="separation">
            <h4>Initiation Details</h4>

            <div className="row">
              <div className="col-sm-6 col-6">
                <h6>Initiated by</h6>
                <p>Atanda Specter</p>
              </div>
              <div className="col-sm-6 col-6">
                <h6>
                  Initiate date <span className="ms-1">{CalenderIcon}</span>
                </h6>
                <p>Jan 11th, 2022 15:20</p>
              </div>
            </div>

            <div className="row ">
              <div className="col-12">
                <h6>
                  Process date to Initaite Interval{' '}
                  <span className="ms-1">{CalenderIcon}</span>
                </h6>
                <p>1 year : 4months : 100 days : 15hrs : 40mins : 23 secs</p>
              </div>
            </div>
          </div>

          <div>
            <h4>Recovery Details</h4>

            <div className="row">
              <div className="col-sm-6 col-6">
                <h6>Initiated by</h6>
                <p>Atanda Specter</p>
              </div>
              <div className="col-sm-6 col-6">
                <h6>
                  Process date <span className="ms-1">{CalenderIcon}</span>
                </h6>
                <p>Jan 11th, 2022 15:20</p>
              </div>
            </div>

            <div className="row pb-lg-5 pb-4">
              <div className="col-12">
                <h6>
                  Report date to Process Interval{' '}
                  <span className="ms-1">{CalenderIcon}</span>
                </h6>
                <p>1 year : 4months : 100 days : 15hrs : 40mins : 23 secs</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* filter modal  */}

      <Modal
        title="Filter by:"
        centered
        open={modalOpen}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
        className="our-modal filter-transaction"
        footer={null}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="status" label="Status:" className="wrap-check-group">
            <>
              <Radio.Group
                options={plainOptions}
                value={statusType}
                onChange={onChanged}
              />
            </>
          </Form.Item>

          <Form.Item
            name="transactionType:"
            label="Transaction type:"
            className="wrap-check-group"
          >
            <>
              <Radio.Group
                onChange={onChanged2}
                value={transactionType}
                options={transactionOptions}
              >
                {/* <Radio value={1}>A</Radio>
                <Radio value={2}>B</Radio>
                <Radio value={3}>C</Radio>
                <Radio value={4}>D</Radio> */}
              </Radio.Group>
            </>
          </Form.Item>
          <Form.Item
            name="rangeFilter"
            label="Date range:"
            className="date-filter"
          >
            <Space direction="" className="flex-wrap">
              <DatePicker
                onChange={onChange}
                placeholder="From"
                style={{
                  width: 270,
                }}
              />
              <DatePicker
                onChange={onChange}
                placeholder="To"
                style={{
                  width: 270,
                }}
              />
            </Space>
          </Form.Item>

          <Form.Item className="buttons">
            <Button
              // type="primary"
              onClick={() => setModalOpen(false)}
              htmlType="submit"
              className="me-3"
              style={{ background: '#7D0003', color: '#fff' }}
            >
              Apply
            </Button>
            <Button
              type="primary"
              onClick={() => setModalOpen(false)}
              style={{ background: '#FFF', color: '#1C1C1C' }}
            >
              Clear
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
}

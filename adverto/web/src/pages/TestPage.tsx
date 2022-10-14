import { API } from 'aws-amplify';
import { useContext } from 'react';
import AuthContext from '../context/auth-context';
import { RoleName } from '../types';
import { executeApi } from '../utils/aws/aws.utils';
import { HttpMethod } from '../utils/http-method.enum';

function TestPage() {
  const { user } = useContext(AuthContext);

  const executeAdvertiserFunction = async () => {
    console.log('executeAdvertiserFunction');
    const response = await executeApi(HttpMethod.POST, '/advertiser-function', {
      customRoleArn: user?.getRoleArnByRoleName(RoleName.ADVERTISER),
      data: { someData: 'some data' },
    });

    console.log(response);
  };

  const executeAdvertiserFunctionViaAPI = async () => {
    console.log('executeAdvertiserFunctionViaAPI');
    const response = await API.post('api', '/advertiser-function', {
      CustomRoleArn: user?.getRoleArnByRoleName(RoleName.ADVERTISER),
    });

    console.log(response);
  };

  const executeAdminFunction = async () => {
    console.log('executeAdminFunction');
    const response = await executeApi(HttpMethod.POST, '/admin-function', {
      data: { name: 'Jane Doe' },
    });

    console.log(response);
  };

  const executeAdminFunctionViaAPI = async () => {
    console.log('executeAdminFunctionViaAPI');
    const response = await API.post('api', '/admin-function', {
      body: { name: 'John Doe' },
    });

    console.log(response);
  };

  return (
    <div className='flex flex-col space-y-2 items-center p-5'>
      <button className='btnPrimary' onClick={executeAdvertiserFunction}>
        Execute advertiser function
      </button>
      <button className='btnPrimary' onClick={executeAdvertiserFunctionViaAPI}>
        Execute advertiser function via API
      </button>
      <button className='btnPrimary' onClick={executeAdminFunction}>
        Execute admin function
      </button>
      <button className='btnPrimary' onClick={executeAdminFunctionViaAPI}>
        Execute admin function via API
      </button>
    </div>
  );
}

export default TestPage;

import mysqlp from 'mysql';
import keys from '../keys';

const connection = mysqlp.createConnection(keys);

export default connection;
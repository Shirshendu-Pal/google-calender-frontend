import {combineReducers} from "redux"
import { authenticateUser, liveToken } from "./all-functions"

const reducers = combineReducers({
    user:authenticateUser
})
    
export default reducers 
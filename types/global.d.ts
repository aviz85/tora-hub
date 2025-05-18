import { Mock } from 'jest-mock';

declare global {
  var mockSignInWithPassword: Mock<any, any>;
  var mockSignUp: Mock<any, any>;
  var mockSignOut: Mock<any, any>;
  var mockSessionGetter: Mock<any, any>;
  var mockStateChange: Mock<any, any>;
} 
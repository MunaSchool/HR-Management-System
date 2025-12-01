# Employee Profile Module - Automated Tests

This directory contains comprehensive end-to-end tests for the Employee Profile module.

## Test Coverage

The test suite covers all requirements from the Employee Profile Requirements document:

### 1. Authentication & Setup
- ✅ Register first admin
- ✅ Login as system admin
- ✅ Login as regular employee
- ✅ Invalid credentials rejection

### 2. Employee Self-Service
- ✅ **US-E2-04**: View full employee profile
- ✅ **US-E2-05**: Update contact information
- ✅ **US-E2-12**: Update biography and profile picture
- ✅ **US-E6-02**: Request profile data correction
- ✅ **US-E2-06**: Request legal name/marital status change

### 3. Department Manager Features
- ✅ **US-E4-01**: View team members
- ✅ **US-E4-02**: View team summary

### 4. HR Admin Features
- ✅ **US-E6-03**: Search for employee data
- ✅ **US-EP-04**: Edit any part of employee profile
- ✅ **US-E2-03**: Review and approve change requests
- ✅ **US-EP-05**: Deactivate employee profile

### 5. System Admin Features
- ✅ **US-E7-05**: Assign roles and permissions
- ✅ Role management (assign, remove, get)
- ✅ Permission management

### 6. Authorization & Access Control
- ✅ 401 Unauthorized (no token, invalid token)
- ✅ 403 Forbidden (insufficient permissions)
- ✅ Role-based access control

### 7. Notifications
- ✅ N-037 (Profile updated)
- ✅ N-040 (Change request submitted)
- ✅ Notification retrieval

### 8. Business Rules Verified
- ✅ **BR 2a-r**: System records specific personal and job data
- ✅ **BR 2n, 2o, 2g**: Phone, Email, Address requirements
- ✅ **BR 3j**: Employee status controls system access
- ✅ **BR 20a**: Only authorized roles can modify data
- ✅ **BR 22**: All changes traced and timestamped
- ✅ **BR 36**: Changes via workflow approval
- ✅ **BR 41b**: Direct Managers see their team only
- ✅ **BR 18b**: Privacy restrictions applied

## Prerequisites

1. **MongoDB**: Make sure MongoDB is running
2. **Environment variables**: `.env` file configured with:
   - `DB_URL` - MongoDB connection string
   - `JWT_SECRET` - Secret for JWT tokens
   - `PORT` - Server port (default: 3000)

## Running the Tests

### Run all E2E tests
```bash
npm run test:e2e
```

### Run tests in watch mode
```bash
npm run test:e2e -- --watch
```

### Run tests with coverage
```bash
npm run test:e2e -- --coverage
```

### Run specific test suite
```bash
npm run test:e2e -- -t "Authentication"
```

### Run tests with verbose output
```bash
npm run test:e2e -- --verbose
```

## Test Database

⚠️ **IMPORTANT**: The tests will:
1. Create test data in your database
2. Clean up after themselves (delete test data)
3. Use the same database configured in `.env`

**Recommendation**: Use a separate test database by creating a `.env.test` file:
```
DB_URL=mongodb://localhost:27017/hr_system_test
JWT_SECRET=your-test-secret
PORT=3001
```

## Test Structure

```
test/
├── employee-profile.e2e-spec.ts    # Main E2E test file
├── jest-e2e.json                   # Jest E2E configuration
└── README.md                        # This file
```

## Test Flow

1. **Setup**: Creates admin and employee accounts
2. **Authentication Tests**: Validates login/token system
3. **Self-Service Tests**: Employee operations
4. **Change Request Flow**: Submit → Review → Approve
5. **HR Admin Tests**: Search, edit, deactivate
6. **Role Management**: Assign, remove, query roles
7. **Authorization Tests**: Access control validation
8. **Cleanup**: Deletes all test data

## Sample Test Output

```
PASS  test/employee-profile.e2e-spec.ts
  Employee Profile Module (e2e)
    1. Setup & Authentication
      ✓ should register first admin (234ms)
      ✓ should login as system admin and get token (123ms)
      ✓ should reject login with invalid credentials (89ms)
      ✓ should create a regular employee for testing (156ms)
      ✓ should login as regular employee (98ms)
    2. US-E2-04: View My Full Employee Profile
      ✓ should return employee profile with all fields (87ms)
      ✓ should include accessProfileId with roles (76ms)
      ✓ should reject request without token (45ms)
    ...

Test Suites: 1 passed, 1 total
Tests:       45 passed, 45 total
Snapshots:   0 total
Time:        12.345s
```

## Troubleshooting

### Database connection errors
- Verify MongoDB is running
- Check `DB_URL` in `.env`
- Ensure MongoDB user has write permissions

### Token/Authentication errors
- Clear test data: Delete employee_profiles, employee_system_roles collections
- Verify `JWT_SECRET` matches between test and app

### Tests timing out
- Increase Jest timeout in test file: `jest.setTimeout(30000);`
- Check network connection to MongoDB

### Port already in use
- Change `PORT` in `.env.test`
- Stop any running instances of the app

## Adding More Tests

To add new tests, follow this pattern:

```typescript
describe('Feature Name', () => {
  it('should do something', async () => {
    const response = await request(app.getHttpServer())
      .get('/endpoint')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('field');
  });
});
```

## CI/CD Integration

Add to your CI pipeline (e.g., GitHub Actions):

```yaml
- name: Run E2E Tests
  run: npm run test:e2e
  env:
    DB_URL: ${{ secrets.TEST_DB_URL }}
    JWT_SECRET: ${{ secrets.TEST_JWT_SECRET }}
```

## Support

For issues or questions:
1. Check the test output for error messages
2. Review the Employee Profile Requirements document
3. Consult the main application README

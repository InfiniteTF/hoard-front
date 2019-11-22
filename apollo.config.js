module.exports = {
    client: {
        service: {
            name: 'hoard',
            url: 'http://192.168.1.218:3000/graphql',
            headers: {
				  Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3QiLCJzdWIiOiJhdXRoIiwiaWF0IjoxNTczNTg1MzcyLCJleHAiOjE1NzM2NzE3NzIsImVtYWlsIjoidGVzdCJ9.Xhw-js_6QsooHY0m4K74lJuDxMxDUOYIspvyIq5jk6_YiSBgr5BIfdqP5OSMEEFGK5931RWdj464aGg6Qtwqb5kgDImXaQB5dax8SiiuuRRGe4IQv1DWe2qOZqdl2ZD5b2VvSA82dZvFCtTlkGv0y_G8_4T18pKE5J75BPSr0gVUhPrPmTojnK1txOEya9bGe0E0lEn61bPxC_JrO4zXZAXGs-i3nNvW5FiEKZnrCasi1GYEop-8asllY3G5qt_tWa1Q1ilhzH15NKaBEL7AP4b-vUleB8zDmCtHycS___BYpS7h6w9F9HVoDeaFdtUDL1aKxmYnyi1q-ZZUpYDy-UfauoelO74K9wAzbT5pezOw9P_kA6gDXRZGmP3K_UMKfMEZcyXBf94pBUWb5eQDjgeFNnUpJpahgCJsD_d-aAcf2dOdDQq0SqbG9JEzHekkIhnlwkhMA1i9YRIfXZkssNi0t6zE3Y4U-Kz4OrgjiPQID4KZ5pGJaEzLWZy2SK_dOLAHoHqbVnIWFrFlPKWPHQ5BsxemZTgMNxQA0GppF62s66G58HoqXCvqE7WqYKgoNgkzKLNQvghVNnmxSZ2pbyuy5l169mT8uojAJZuANuRF5ipqi_8_khPVHDWnISSAfEDta4ryvKvj-DGtogfSvSw2pK_xgpR0N-ixyK49AQ8"
            }
        },
        excludes: ['**/queries/**/_*', '**/mutations/**/_*', '**/__tests__/**/*', '**/node_modules']
    }
};

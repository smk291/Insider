// eslint-disable-next-line func-names
exports.seed = function (knex) {
  return knex('listings').del().then(() => {
    return knex('listings').insert([
      {
        bath: 'private bath',
        bedrooms: '2BR',
        cat: null,
        created_at: '2017-01-01T21:58:25.790Z',
        descr: '\nGreat fully furnished 2BD/2BA apartment available from Dec 31\n2016.',
        dog: 'dogs are OK - wooof',
        furnished: 'furnished',
        housing: 'apartment',
        id: 1,
        last_checked: '2017-01-03T16:53:26.395Z',
        lat: '47.690520',
        laundry: 'laundry in bldg',
        lon: '-122.349839',
        neighborhood: '(8500 Fremont Ave N, Seattle)',
        parking: 'off-street parking',
        photos: {
          photos: [
            '00B0B_6lzXZIjJmQd',
            '01111_eXBbVBHqYFd',
            '00A0A_2u3c7spsn29',
            '00w0w_9w4BDIrc2zH',
            '00g0g_OrIkrfM7mD',
            '00r0r_bo6k3H76jCj',
            '00T0T_gvPopRUkcZW',
            '00x0x_9CyitWon6Hh',
            '00G0G_3QwByJiu8E9',
            '01212_ioZPUhlsmx9',
          ],
        },
        post_date: 'Dec 31',
        price: 2695,
        private_room: 'private room',
        smoking: 'no smoking',
        sqft: '1000',
        street_address: '',
        sub_or_apt: 'sub',
        title: 'Executive FURNISHED 2BD/2BA apt.Short term/\nSeattle/Best Location12/31',
        updated_at: '2017-01-01T21:58:25.790Z',
        url: '/see/sub/5940205032.html',
        urlnum: '5940205032',
        void: false,
        wheelchair: null,
      }, {
        bath: 'private bath',
        bedrooms: '2BR',
        cat: null,
        created_at: '2017-01-01T21:58:25.790Z',
        descr: '\nGreat fully furnished 2BD/2BA apartment available from Dec 31\n2016.',
        dog: 'dogs are OK - wooof',
        furnished: 'furnished',
        housing: 'apartment',
        id: 2,
        last_checked: '2017-01-03T16:53:26.395Z',
        lat: '47.690520',
        laundry: 'laundry in bldg',
        lon: '-122.349839',
        neighborhood: '(8500 Fremont Ave N, Seattle)',
        parking: 'off-street parking',
        photos: {
          photos: [
            '00B0B_6lzXZIjJmQd',
            '01111_eXBbVBHqYFd',
            '00A0A_2u3c7spsn29',
            '00w0w_9w4BDIrc2zH',
            '00g0g_OrIkrfM7mD',
            '00r0r_bo6k3H76jCj',
            '00T0T_gvPopRUkcZW',
            '00x0x_9CyitWon6Hh',
            '00G0G_3QwByJiu8E9',
            '01212_ioZPUhlsmx9',
          ],
        },
        post_date: 'Dec 31',
        price: 2695,
        private_room: 'private room',
        smoking: 'no smoking',
        sqft: '1000',
        street_address: '',
        sub_or_apt: 'sub',
        title: 'Executive FURNISHED 2BD/2BA apt.Short term/\nSeattle/Best Location12/31',
        updated_at: '2017-01-01T21:58:25.790Z',
        url: '/see/sub/5940204098.html',
        urlnum: '5940204098',
        void: false,
        wheelchair: null,
      }, {
        bath: 'private bath',
        bedrooms: '2BR',
        cat: null,
        created_at: '2017-01-01T21:58:25.790Z',
        descr: '\nFurnished 2BR/1BA Mother-in-law apartment in private view home soon\navailable for a quality single guest on a weekly/monthly basis. It\nis completely furnished with all bedding, sheets, towels,\nutilities, cable TV and high-speed wireless internet included.\nIdeal temporary housing for someone relocating for work. Clean,\nquiet, and comfortable make this apt desirable, not to mention the\nspectacular unobstructed water and mountain views. It has a private\nentrance with off street parking, and a large living/dining/kitchen\narea. The kitchenette has a full size fridge/freezer, new sink and\ncounter top with microwave, toaster over, coffee maker, etc. and is\nalso equipped with dishes/pots/pans, etc.',
        dog: null,
        furnished: 'furnished',
        housing: 'in-law',
        id: 3,
        last_checked: '2017-01-03T16:53:26.395Z',
        lat: '47.823183',
        laundry: null,
        lon: '-122.360058',
        neighborhood: '(N\nEdmonds)',
        parking: 'off-street parking',
        photos: {
          photos: ['00J0J_fGlvYyJlk7N', '00S0S_94tDYHdcdmO', '00P0P_caKcrEPeOx1'],
        },
        post_date: 'Dec 31',
        price: 1500,
        private_room: 'private room',
        smoking: 'no smoking',
        sqft: '800',
        street_address: '',
        sub_or_apt: 'sub',
        title: 'Furnished Mother-in-Law apt cable wifi and\nall utilities included',
        updated_at: '2017-01-01T21:58:25.790Z',
        url: '/sno/sub/5910154143.html',
        urlnum: '5910154143',
        void: false,
        wheelchair: null,
      }, {
        bath: 'private bath',
        bedrooms: '2BR',
        cat: null,
        created_at: '2017-01-01T21:58:25.791Z',
        descr: '\nMove-in ready fully furnished view home with cable TV, Wifi and all\nutilities. Just unpack your clothes and you are home sweet home\naway from home :) Ideal for relocating executives.',
        dog: null,
        furnished: 'furnished',
        housing: 'house',
        id: 4,
        last_checked: '2017-01-03T16:53:26.395Z',
        lat: '47.825027',
        laundry: 'w/d in unit',
        lon: '-122.358170',
        neighborhood: '(Edmonds)',
        parking: 'carport',
        photos: {
          photos: ['00M0M_6Dwe0R9A8Yi', '01313_5FJV6d90IOJ', '00d0d_hm0icm8IvuJ', '00M0M_a8Q1Y77zihx'],
        },
        post_date: 'Dec 31',
        price: 2500,
        private_room: 'private room',
        smoking: 'no smoking',
        sqft: '2400',
        street_address: '',
        sub_or_apt: 'sub',
        title: 'FULLY FURNISHED VIEW HOME Monthly',
        updated_at: '2017-01-01T21:58:25.791Z',
        url: '/sno/sub/5905305651.html',
        urlnum: '5905305651',
        void: false,
        wheelchair: null,
      }, {
        bath: 'private bath',
        bedrooms: '1BR',
        cat: null,
        created_at: '2017-01-01T21:58:25.791Z',
        descr: '\nHave very nice furnished 1 bedroom apartment wish to rent month of\nFebruary in the hip, interesting, convenient-to-everything Columbia\nCity neighborhood. Features, quality stainless appliances, 4th\nfloor view of Columbia City entertainment district. Great\nrestaurants, bars, movie theatre, banks, PCC upscale grocery store,\nbike store, florist, art galleries, nightclubs, brewery - ALL\nwithin 3 blocks of apartment. Quiet, convenient to downtown - 9\nminute walk to Columbia City Link Light Rail station, parking in\nunderground garage for 1 car. Apartment normally rents for $1,600 -\n$1,900/ month - will rent for $1,000 with $300 security deposit. As\nthis is our apartment and our things, need to meet in person to\nshow apartment prior to rental by appointment - I work nearby and\nhave flexible work shedule so can meet most anytime except Monday\nmornings.',
        dog: null,
        furnished: 'furnished',
        housing: 'apartment',
        id: 5,
        last_checked: '2017-01-03T16:53:26.395Z',
        lat: '47.557021',
        laundry: 'w/d in unit',
        lon: '-122.284635',
        neighborhood: '(Columbia\nCity)',
        parking: 'attached garage',
        photos: {
          photos: [
            '01111_7YID7cC1ICH',
            '00r0r_6ee5ZIcRvGc',
            '00f0f_9MbgVtFsPUj',
            '00g0g_2DkI5XgRaeA',
            '00Y0Y_cuqGm9Ohlgy',
            '00j0j_83Rgn3CbLWn',
            '00000_9vo6EWvKuGD',
            '00J0J_iJEVqxIIYxm',
            '00X0X_ftBGUHCYr4y',
            '00b0b_hV0XJlRAKQC',
            '00h0h_jphb3AtCgam',
            '00U0U_bDXLmHzgXTr',
            '00y0y_bx5O8vVBWTu',
            '00F0F_k5tT4oyBkgn',
            '00Y0Y_8UiKAF35Gr9',
          ],
        },
        post_date: 'Dec 31',
        price: 1000,
        private_room: 'private room',
        smoking: 'no smoking',
        sqft: '650',
        street_address: 'South Hudson St at Rainier South',
        sub_or_apt: 'sub',
        title: 'Apartment Furnished\nFebruary-Great&Cheap',
        updated_at: '2017-01-01T21:58:25.791Z',
        url: '/see/sub/5940246129.html',
        urlnum: '5940246129',
        void: false,
        wheelchair: null,
      }, {
        bath: null,
        bedrooms: '1BR',
        cat: null,
        created_at: '2017-01-01T21:58:25.792Z',
        descr: '\nLOCATED IN SILVERDALE, WA NEXT TO POULSBO, BREMERTON, AND NEAR\nNAVAL BASE KITSAP (PSNS, Keyport, and Bangor).',
        dog: null,
        furnished: null,
        housing: null,
        id: 6,
        last_checked: '2017-01-03T16:53:26.395Z',
        lat: null,
        laundry: null,
        lon: null,
        neighborhood: '(Silverdale)',
        parking: null,
        photos: {
          photos: [
            '00a0a_eE8X5puDH7B',
            '00x0x_jTYLSf0qKAW',
            '00C0C_7FcP8FQ9AvT',
            '00e0e_2EST25sqiy2',
            '00p0p_mvIL5U5Zrl',
            '00E0E_eio2rBrTPib',
            '00202_bEY05Bj3Egs',
            '00808_nQX3R8cneX',
            '00b0b_jjDJK13xXTT',
            '00i0i_aDPW8mNjoI2',
            '00I0I_Fs5ZZp7jcU',
            '00D0D_aszwUfSXaou',
            '00T0T_kl1Iq3k9Cbt',
          ],
        },
        post_date: 'Dec 31',
        price: 99,
        private_room: null,
        smoking: null,
        sqft: null,
        street_address: '',
        sub_or_apt: 'sub',
        title: 'Euro Modern 1 bd 1 ba - ALL INCLUSIVE PRICING\n+ LOW ALLERGEN',
        updated_at: '2017-01-01T21:58:25.792Z',
        url: '/kit/sub/5940332102.html',
        urlnum: '5940332102',
        void: false,
        wheelchair: null,
      }, {
        bath: 'private bath',
        bedrooms: '1BR',
        cat: 'cats are OK - purrr',
        created_at: '2017-01-01T21:58:25.793Z',
        descr: '\nRemodeled in April 2015, this modern quiet condo sleeps up to 4\nadult guests comfortably, offers a balcony overlooking the garden,\na full kitchen with stainless steel appliances, a luxurious queen\nsize bed in the bedroom with an American Leather queen sleeper in\nthe living room. It offers HDTV flat screen TV\'s and wireless\ninternet.Secure underground entrances and parking is available on\nsite, as well as a heated swimming pool, hot tub, day room,\nspacious rooftop deck and a fully equipped fitness center with a\nsauna. While the building itself is located in the heart of\nBelltown, this condo faces the beautiful garden courtyard which\nensures a quiet place to stay.',
        dog: 'dogs are OK - wooof',
        furnished: 'furnished',
        housing: 'condo',
        id: 7,
        last_checked: '2017-01-03T16:53:26.395Z',
        lat: '47.615100',
        laundry: 'laundry in bldg',
        lon: '-122.344700',
        neighborhood: '(Seattle)',
        parking: 'valet parking',
        photos: {
          photos: [
            '00d0d_1NHIlLcxEge',
            '00202_7h5om4UMlD',
            '00404_4hrPEwWCyI',
            '00000_3tRAe6fF1mq',
            '01414_lDBaK5Rtvp',
            '00r0r_loYYWJRjc6v',
            '00404_hYR1dKuQbQ1',
            '01313_6HZ430ChbCN',
            '00606_37nGbhCLvn9',
            '00q0q_l7s5R7NbmGw',
          ],
        },
        post_date: 'Dec 31',
        price: 2000,
        private_room: 'private room',
        smoking: 'no smoking',
        sqft: '742',
        street_address: '',
        sub_or_apt: 'sub',
        title: 'Beautiful furnished Belltown Condo With\nAmenities',
        updated_at: '2017-01-01T21:58:25.793Z',
        url: '/see/sub/5917286230.html',
        urlnum: '5917286230',
        void: false,
        wheelchair: null,
      }, {
        bath: 'private bath',
        bedrooms: '1BR',
        cat: 'cats are OK - purrr',
        created_at: '2017-01-01T21:58:25.793Z',
        descr: '\n$1550/month',
        dog: 'dogs are OK - wooof',
        furnished: 'furnished',
        housing: 'apartment',
        id: 8,
        last_checked: '2017-01-03T16:53:26.395Z',
        lat: '47.606684',
        laundry: 'laundry in bldg',
        lon: '-122.304000',
        neighborhood: '(Central\nDistrict)',
        parking: 'street parking',
        photos: {
          photos: [
            '00b0b_6VAnKkDlJHR',
            '01212_4C49QaCOHXT',
            '00C0C_4zJlJHEF5nU',
            '00C0C_iKnctMS4tDW',
            '00M0M_fWDp0hquJKD',
            '00m0m_59Q3O8lGF0y',
            '00P0P_cvENxcCJCBj',
            '00E0E_gXLWNivXnAO',
            '00w0w_30Owmv1mgTs',
          ],
        },
        post_date: 'Dec 31',
        price: 1550,
        private_room: 'private room',
        smoking: 'no smoking',
        sqft: '550',
        street_address: '22nd at James',
        sub_or_apt: 'sub',
        title: 'Charming Furnished 1-Bedroom Apartment in\nWalking Neighborhood',
        updated_at: '2017-01-01T21:58:25.793Z',
        url: '/see/sub/5932061017.html',
        urlnum: '5932061017',
        void: false,
        wheelchair: null,
      }, {
        bath: 'private bath',
        bedrooms: '1BR',
        cat: 'cats are OK - purrr',
        created_at: '2017-01-01T21:58:25.803Z',
        descr: '\nLooking for someone to take over my lease that runs till 7/31/17\nyou do have an option to resign the lease. It is spacious 1\nbedroom. You will have to apply for through the rental management\ncompany which has a fee of $49. Rent is $1365 a month plus $60 per\nperson for utlities. There is parking limited to 1-2 cars you share\nthe parking spots with neighbors so sometimes there\'s only one\nspot. Also will be selling some of my furniture we can work\nsomething out if you also could use some furniture. Please contact\nme for more information and the website to apply for the\napartment',
        dog: 'dogs are OK - wooof',
        furnished: null,
        housing: 'apartment',
        id: 9,
        last_checked: '2017-01-03T16:53:26.395Z',
        lat: '47.621308',
        laundry: 'laundry in bldg',
        lon: '-122.357032',
        neighborhood: '',
        parking: 'no parking',
        photos: {
          photos: [
            '00l0l_ekJrTiKznHs',
            '00K0K_cYQGP81jCZ1',
            '00p0p_9kHQxlNUT7y',
            '00T0T_gg5yc3KR1wG',
            '00T0T_fF7goi53Xzl',
            '00z0z_1nrcNxSB50T',
            '00i0i_bRiaoAp0VX1',
            '00t0t_jqLUzS26cc1',
            '00808_15U97yM007r',
            '01414_i4jOQESGwob',
          ],
        },
        post_date: 'Dec 31',
        price: 1365,
        private_room: 'private room',
        smoking: null,
        sqft: null,
        street_address: '',
        sub_or_apt: 'sub',
        title: '1x1 Queen Anne',
        updated_at: '2017-01-01T21:58:25.803Z',
        url: '/see/sub/5940361044.html',
        urlnum: '5940361044',
        void: false,
        wheelchair: null,
      }, {
        bath: 'no private bath',
        bedrooms: '1BR',
        cat: null,
        created_at: '2017-01-01T21:58:25.804Z',
        descr: '\n$30.00 per night with a twenty day maximum. $45.00 for a second\nperson, cash up front , access to kitchen, common area is private.\nWiFi available, No parties, no smoking, no drugs, no drinking, no\npets, no visitors. Please bring class and manners or your money\nwill be refunded and you will be asked to leave.',
        dog: null,
        furnished: 'furnished',
        housing: 'apartment',
        id: 10,
        last_checked: '2017-01-03T16:53:26.395Z',
        lat: '47.755900',
        laundry: 'w/d in unit',
        lon: '-122.300300',
        neighborhood: '(SHORLINE)',
        parking: 'street parking',
        photos: {
          photos: ['01212_hQykhjxxYV1'],
        },
        post_date: 'Dec 31',
        price: 30,
        private_room: 'private room',
        smoking: 'no smoking',
        sqft: '216',
        street_address: '19835 25th ave Ne',
        sub_or_apt: 'sub',
        title: 'SINGLE ROOM',
        updated_at: '2017-01-01T21:58:25.804Z',
        url: '/see/sub/5940326521.html',
        urlnum: '5940326521',
        void: false,
        wheelchair: null,
      },
    ]).then(() => {
      return knex.raw('SELECT setval(\'listings_id_seq\', (SELECT MAX(id) FROM listings));');
    });
  });
};

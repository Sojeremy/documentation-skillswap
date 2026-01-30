[**SkillSwap Frontend API**](../index.md)

***

[SkillSwap Frontend API](../index.md) / lib/api-types

# lib/api-types

## Interfaces

### UserInfo

Defined in: [lib/api-types.ts:5](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L5)

#### Extended by

- [`CurrentUser`](#currentuser)
- [`UserVisit`](#uservisit)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="id"></a> `id` | `number` | [lib/api-types.ts:6](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L6) |
| <a id="firstname"></a> `firstname` | `string` | [lib/api-types.ts:7](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L7) |
| <a id="lastname"></a> `lastname` | `string` | [lib/api-types.ts:8](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L8) |
| <a id="avatarurl"></a> `avatarUrl?` | `string` | [lib/api-types.ts:9](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L9) |

***

### CurrentUser

Defined in: [lib/api-types.ts:12](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L12)

#### Extends

- [`UserInfo`](#userinfo)

#### Properties

| Property | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="id-1"></a> `id` | `number` | [`UserInfo`](#userinfo).[`id`](#id) | [lib/api-types.ts:6](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L6) |
| <a id="firstname-1"></a> `firstname` | `string` | [`UserInfo`](#userinfo).[`firstname`](#firstname) | [lib/api-types.ts:7](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L7) |
| <a id="lastname-1"></a> `lastname` | `string` | [`UserInfo`](#userinfo).[`lastname`](#lastname) | [lib/api-types.ts:8](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L8) |
| <a id="avatarurl-1"></a> `avatarUrl?` | `string` | [`UserInfo`](#userinfo).[`avatarUrl`](#avatarurl) | [lib/api-types.ts:9](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L9) |
| <a id="email"></a> `email` | `string` | - | [lib/api-types.ts:13](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L13) |

***

### UserVisit

Defined in: [lib/api-types.ts:16](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L16)

#### Extends

- [`UserInfo`](#userinfo)

#### Properties

| Property | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="id-2"></a> `id` | `number` | [`UserInfo`](#userinfo).[`id`](#id) | [lib/api-types.ts:6](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L6) |
| <a id="firstname-2"></a> `firstname` | `string` | [`UserInfo`](#userinfo).[`firstname`](#firstname) | [lib/api-types.ts:7](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L7) |
| <a id="lastname-2"></a> `lastname` | `string` | [`UserInfo`](#userinfo).[`lastname`](#lastname) | [lib/api-types.ts:8](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L8) |
| <a id="avatarurl-2"></a> `avatarUrl?` | `string` | [`UserInfo`](#userinfo).[`avatarUrl`](#avatarurl) | [lib/api-types.ts:9](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L9) |
| <a id="israted"></a> `isRated` | `boolean` | - | [lib/api-types.ts:17](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L17) |
| <a id="isfollowing"></a> `isFollowing` | `boolean` | - | [lib/api-types.ts:18](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L18) |

***

### AuthFormData

Defined in: [lib/api-types.ts:21](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L21)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="email-1"></a> `email` | `string` | [lib/api-types.ts:22](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L22) |
| <a id="password"></a> `password` | `string` | [lib/api-types.ts:23](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L23) |
| <a id="confirmation"></a> `confirmation?` | `string` | [lib/api-types.ts:24](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L24) |
| <a id="firstname-3"></a> `firstname?` | `string` | [lib/api-types.ts:25](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L25) |
| <a id="lastname-3"></a> `lastname?` | `string` | [lib/api-types.ts:26](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L26) |

***

### SearchResults

Defined in: [lib/api-types.ts:35](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L35)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="members"></a> `members` | [`Member`](#member)[] | [lib/api-types.ts:36](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L36) |
| <a id="total"></a> `total` | `number` | [lib/api-types.ts:37](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L37) |
| <a id="page"></a> `page` | `number` | [lib/api-types.ts:38](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L38) |
| <a id="totalpages"></a> `totalPages` | `number` | [lib/api-types.ts:39](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L39) |
| <a id="processingtimems"></a> `processingTimeMs` | `number` | [lib/api-types.ts:40](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L40) |

***

### SearchParams

Defined in: [lib/api-types.ts:43](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L43)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="q"></a> `q?` | `string` | [lib/api-types.ts:44](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L44) |
| <a id="category"></a> `category?` | `string` | [lib/api-types.ts:45](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L45) |
| <a id="page-1"></a> `page?` | `number` | [lib/api-types.ts:46](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L46) |
| <a id="limit"></a> `limit?` | `number` | [lib/api-types.ts:47](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L47) |

***

### Member

Defined in: [lib/api-types.ts:55](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L55)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="id-3"></a> `id` | `number` | [lib/api-types.ts:56](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L56) |
| <a id="firstname-4"></a> `firstname` | `string` | [lib/api-types.ts:57](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L57) |
| <a id="lastname-4"></a> `lastname` | `string` | [lib/api-types.ts:58](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L58) |
| <a id="avatarurl-3"></a> `avatarUrl` | `string` \| `null` | [lib/api-types.ts:59](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L59) |
| <a id="skills"></a> `skills` | `string`[] | [lib/api-types.ts:60](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L60) |
| <a id="rating"></a> `rating` | `number` | [lib/api-types.ts:61](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L61) |
| <a id="evaluationcount"></a> `evaluationCount` | `number` | [lib/api-types.ts:62](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L62) |

***

### SkillItem

Defined in: [lib/api-types.ts:70](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L70)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="id-4"></a> `id` | `number` | [lib/api-types.ts:71](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L71) |
| <a id="name"></a> `name` | `string` | [lib/api-types.ts:72](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L72) |
| <a id="categoryid"></a> `categoryId` | `number` | [lib/api-types.ts:73](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L73) |

***

### UserHasSkill

Defined in: [lib/api-types.ts:76](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L76)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="userid"></a> `userId` | `number` | [lib/api-types.ts:77](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L77) |
| <a id="skillid"></a> `skillId` | `number` | [lib/api-types.ts:78](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L78) |
| <a id="skill"></a> `skill?` | [`SkillItem`](#skillitem) | [lib/api-types.ts:79](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L79) |
| <a id="createdat"></a> `createdAt` | `string` | [lib/api-types.ts:80](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L80) |
| <a id="updatedat"></a> `updatedAt` | `string` | [lib/api-types.ts:81](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L81) |

***

### UserHasInterest

Defined in: [lib/api-types.ts:84](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L84)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="userid-1"></a> `userId` | `number` | [lib/api-types.ts:85](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L85) |
| <a id="skillid-1"></a> `skillId` | `number` | [lib/api-types.ts:86](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L86) |
| <a id="skill-1"></a> `skill?` | [`SkillItem`](#skillitem) | [lib/api-types.ts:87](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L87) |
| <a id="createdat-1"></a> `createdAt` | `string` | [lib/api-types.ts:88](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L88) |
| <a id="updatedat-1"></a> `updatedAt` | `string` | [lib/api-types.ts:89](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L89) |

***

### AvailableSlot

Defined in: [lib/api-types.ts:92](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L92)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="id-5"></a> `id` | `number` | [lib/api-types.ts:93](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L93) |
| <a id="day"></a> `day` | `string` | [lib/api-types.ts:94](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L94) |
| <a id="timeslot"></a> `timeSlot` | `string` | [lib/api-types.ts:95](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L95) |
| <a id="createdat-2"></a> `createdAt` | `string` | [lib/api-types.ts:96](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L96) |
| <a id="updatedat-2"></a> `updatedAt` | `string` | [lib/api-types.ts:97](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L97) |

***

### UserHasAvailable

Defined in: [lib/api-types.ts:100](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L100)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="userid-2"></a> `userId` | `number` | [lib/api-types.ts:101](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L101) |
| <a id="availableid"></a> `availableId` | `number` | [lib/api-types.ts:102](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L102) |
| <a id="available"></a> `available` | [`AvailableSlot`](#availableslot) | [lib/api-types.ts:103](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L103) |
| <a id="createdat-3"></a> `createdAt` | `string` | [lib/api-types.ts:104](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L104) |
| <a id="updatedat-3"></a> `updatedAt` | `string` | [lib/api-types.ts:105](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L105) |

***

### Evaluator

Defined in: [lib/api-types.ts:108](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L108)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="id-6"></a> `id` | `number` | [lib/api-types.ts:109](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L109) |
| <a id="firstname-5"></a> `firstname` | `string` | [lib/api-types.ts:110](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L110) |
| <a id="lastname-5"></a> `lastname` | `string` | [lib/api-types.ts:111](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L111) |
| <a id="avatarurl-4"></a> `avatarUrl` | `string` \| `null` | [lib/api-types.ts:112](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L112) |

***

### Evaluation

Defined in: [lib/api-types.ts:115](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L115)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="id-7"></a> `id` | `number` | [lib/api-types.ts:116](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L116) |
| <a id="comments"></a> `comments` | `string` | [lib/api-types.ts:117](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L117) |
| <a id="score"></a> `score` | `number` | [lib/api-types.ts:118](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L118) |
| <a id="evaluatorid-1"></a> `evaluatorId` | `number` | [lib/api-types.ts:119](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L119) |
| <a id="evaluator-1"></a> `evaluator?` | [`Evaluator`](#evaluator) | [lib/api-types.ts:120](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L120) |
| <a id="evaluatedid"></a> `evaluatedId` | `number` | [lib/api-types.ts:121](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L121) |
| <a id="createdat-4"></a> `createdAt` | `string` | [lib/api-types.ts:122](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L122) |
| <a id="updatedat-4"></a> `updatedAt` | `string` | [lib/api-types.ts:123](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L123) |

***

### Profile

Defined in: [lib/api-types.ts:126](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L126)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="id-8"></a> `id` | `number` | [lib/api-types.ts:127](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L127) |
| <a id="firstname-6"></a> `firstname` | `string` | [lib/api-types.ts:128](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L128) |
| <a id="lastname-6"></a> `lastname` | `string` | [lib/api-types.ts:129](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L129) |
| <a id="avatarurl-5"></a> `avatarUrl` | `string` \| `null` | [lib/api-types.ts:130](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L130) |
| <a id="description"></a> `description` | `string` \| `null` | [lib/api-types.ts:131](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L131) |
| <a id="address"></a> `address` | `string` \| `null` | [lib/api-types.ts:132](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L132) |
| <a id="postalcode"></a> `postalCode` | `number` \| `null` | [lib/api-types.ts:133](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L133) |
| <a id="city"></a> `city` | `string` \| `null` | [lib/api-types.ts:134](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L134) |
| <a id="age"></a> `age` | `number` \| `null` | [lib/api-types.ts:135](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L135) |
| <a id="createdat-5"></a> `createdAt` | `string` | [lib/api-types.ts:136](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L136) |
| <a id="updatedat-5"></a> `updatedAt` | `string` | [lib/api-types.ts:137](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L137) |
| <a id="skills-1"></a> `skills` | [`UserHasSkill`](#userhasskill)[] | [lib/api-types.ts:139](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L139) |
| <a id="interests"></a> `interests` | [`UserHasInterest`](#userhasinterest)[] | [lib/api-types.ts:140](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L140) |
| <a id="availabilities"></a> `availabilities` | [`UserHasAvailable`](#userhasavailable)[] | [lib/api-types.ts:141](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L141) |
| <a id="evaluationsreceived"></a> `evaluationsReceived` | [`Evaluation`](#evaluation)[] | [lib/api-types.ts:142](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L142) |
| <a id="israted-1"></a> `isRated?` | `boolean` | [lib/api-types.ts:144](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L144) |
| <a id="isfollowing-1"></a> `isFollowing?` | `boolean` | [lib/api-types.ts:145](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L145) |
| <a id="isfollowedby"></a> `isFollowedBy?` | `boolean` | [lib/api-types.ts:146](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L146) |

***

### Category

Defined in: [lib/api-types.ts:153](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L153)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="id-9"></a> `id` | `number` | [lib/api-types.ts:154](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L154) |
| <a id="name-1"></a> `name` | `string` | [lib/api-types.ts:155](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L155) |
| <a id="slug"></a> `slug` | `string` | [lib/api-types.ts:156](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L156) |

***

### AddRatingData

Defined in: [lib/api-types.ts:163](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L163)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="score-1"></a> `score` | `number` | [lib/api-types.ts:164](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L164) |
| <a id="comment"></a> `comment?` | `string` | [lib/api-types.ts:165](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L165) |

***

### Message

Defined in: [lib/api-types.ts:172](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L172)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="id-10"></a> `id` | `number` | [lib/api-types.ts:173](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L173) |
| <a id="sender"></a> `sender?` | [`UserInfo`](#userinfo) | [lib/api-types.ts:174](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L174) |
| <a id="content"></a> `content` | `string` | [lib/api-types.ts:175](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L175) |
| <a id="timestamp"></a> `timestamp` | `string` | [lib/api-types.ts:176](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L176) |

***

### Conversation

Defined in: [lib/api-types.ts:180](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L180)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="id-11"></a> `id` | `number` | [lib/api-types.ts:181](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L181) |
| <a id="participant"></a> `participant?` | [`UserVisit`](#uservisit) | [lib/api-types.ts:182](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L182) |
| <a id="title"></a> `title` | `string` | [lib/api-types.ts:183](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L183) |
| <a id="lastmessage"></a> `lastMessage?` | [`Message`](#message) | [lib/api-types.ts:184](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L184) |
| <a id="status"></a> `status` | `"Open"` \| `"Close"` | [lib/api-types.ts:185](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L185) |

***

### ConversationWithMsg

Defined in: [lib/api-types.ts:189](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L189)

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="id-12"></a> `id` | `number` | [lib/api-types.ts:190](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L190) |
| <a id="participant-1"></a> `participant?` | [`UserVisit`](#uservisit) | [lib/api-types.ts:191](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L191) |
| <a id="title-1"></a> `title` | `string` | [lib/api-types.ts:192](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L192) |
| <a id="status-1"></a> `status` | `"Open"` \| `"Close"` | [lib/api-types.ts:193](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L193) |
| <a id="messages"></a> `messages?` | [`Message`](#message)[] | [lib/api-types.ts:194](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L194) |

## Type Aliases

### AuthFormMode

> **AuthFormMode** = `"login"` \| `"register"`

Defined in: [lib/api-types.ts:29](https://github.com/O-clock-Dublin/projet-skillswap/blob/main/frontend/src/lib/api-types.ts#L29)

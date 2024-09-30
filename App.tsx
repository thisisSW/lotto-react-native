/* eslint-disable @typescript-eslint/no-unused-vars */

import axios from 'axios';
import React, {
  Component,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import {
  BackHandler,
  SafeAreaView,
  ToastAndroid,
  Alert,
  Platform,
  NativeModules,
  View,
  Linking,
  Text,
  Button,
  TextInput,
  StyleSheet,
} from 'react-native';

let App = () => {
  const [allNumbers, setAllNumbers] = useState<number[][]>([]);
  const [drowNo, setDrowNo] = useState('');
  const [numbers, setNumbers] = useState<number[]>([]);
  const [counts, setCounts] = useState({
    ones: 0,
    tens: 0,
    twenties: 0,
    thirties: 0,
    forties: 0,
  });

  const onChangeText = (e: any) => {
    setDrowNo(e);
  };

  const drowClick = async () => {
    const newNumbers = [];

    if (drowNo) {
      if (drowNo === '000619') {
        Alert.alert('강민 공부해라!');
      } else if (drowNo === '240722') {
        Alert.alert('두근 두근 강민 사랑한다!');
      }

      for (let i = 0; i < 10; i++) {
        const newDrowNo = Number(drowNo) - i;
        const success = await axios.get(
          `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${newDrowNo}`,
        );
        if (success.data.returnValue === 'success') {
          for (let i = 1; i <= 6; i++) {
            newNumbers.push(success.data[`drwtNo${i}`]);
          }
          newNumbers.push(success.data.bnusNo);
          setNumbers(Array.from(new Set(newNumbers)).sort((a, b) => a - b));
          console.log(
            '10게임 동안 나온 수 : ',
            // Array.from(new Set(newNumbers)).sort((a, b) => a - b),
            // numbers,
            newNumbers,
          );
        }
      }
      const newCounts = {
        ones: 0,
        tens: 0,
        twenties: 0,
        thirties: 0,
        forties: 0,
      };

      newNumbers.forEach(num => {
        if (num >= 1 && num <= 10) {
          newCounts.ones++;
        } else if (num >= 11 && num <= 20) {
          newCounts.tens++;
        } else if (num >= 21 && num <= 30) {
          newCounts.twenties++;
        } else if (num >= 31 && num <= 40) {
          newCounts.thirties++;
        } else if (num >= 41 && num <= 45) {
          newCounts.forties++;
        }
      });
      setCounts(newCounts);
    } else {
      Alert.alert('추첨 회차를 입력해주세요.');
    }
  };

  const generateNumbers = () => {
    // 5번의 추출 결과를 저장할 배열
    const newAllNumbers = [];

    //최근 10게임 동안 안나온 번호 배열
    const allNumbers = Array.from({length: 45}, (_, i) => i + 1).filter(
      num => !numbers.includes(num),
    );
    console.log('10게임 동안 안나온 수 : ' + allNumbers);
    // 5번 숫자 추출
    for (let i = 0; i < 5; i++) {
      // 제외 할 숫자 제외
      const excludeNumbers = Array.from({length: 45}, (_, i) => i + 1).filter(
        num => !allNumbers.includes(num),
      );

      // 숫자를 랜덤하게 섞습니다.
      const shuffledNumbers = excludeNumbers.sort(() => Math.random() - 0.5);
      // 상위 6개의 숫자를 선택합니다.
      const selectedNumbers = shuffledNumbers.slice(0, 6);
      // 선택된 숫자를 오름차순으로 정렬합니다.
      const sortedNumbers = selectedNumbers.sort((a, b) => a - b);
      // 결과를 배열에 추가합니다.
      newAllNumbers.push(sortedNumbers);
    }

    // 상태를 업데이트합니다.
    setAllNumbers(newAllNumbers);
  };

  useEffect(() => {
    const aaa = [13, 14, 20, 28, 29, 34];
    console.log('123123123' + allNumbers);
  }, [allNumbers]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>헤더 제목</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="숫자를 입력하세요"
            value={drowNo}
            onChangeText={onChangeText}
          />
          <Button title="회차 조회" onPress={drowClick} />
        </View>
        <View style={styles.numbersContainer}>
          {allNumbers.map((numbers, index) => (
            <View key={index} style={styles.numbersRow}>
              {numbers.map((number, idx) => (
                <View key={idx} style={styles.numberBox}>
                  <Text style={styles.numberText}>{number}</Text>
                </View>
              ))}
            </View>
          ))}
          <Text>[13, 14, 20, 28, 29, 34]</Text>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{margin: 8}}>1의 자리 갯수 {counts.ones}개</Text>
          <Text style={{margin: 8}}>10 자리 갯수 {counts.tens}개</Text>
          <Text style={{margin: 8}}>20 자리 갯수 {counts.twenties}개</Text>
          <Text style={{margin: 8}}>30 자리 갯수 {counts.thirties}개</Text>
          <Text style={{margin: 8}}>40 자리 갯수 {counts.forties}개</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Button title="번호 추첨하기" onPress={generateNumbers} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  inputRow: {
    flexDirection: 'row', // Input과 Button을 가로로 배치
    alignItems: 'center', // 세로 정렬
    marginBottom: 20,
  },
  body: {
    flex: 1,
    justifyContent: 'flex-start', // 상단 정렬
    padding: 16,
  },
  input: {
    flex: 1, // 남는 공간을 차지하게 함
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    paddingLeft: 8,
  },
  numbersRow: {
    flexDirection: 'row', // 가로 정렬
    justifyContent: 'center', // 중앙 정렬
    flexWrap: 'wrap', // 줄바꿈
    marginBottom: 20,
  },
  numbersContainer: {
    flexDirection: 'row', // 가로 정렬
    justifyContent: 'center', // 중앙 정렬
    flexWrap: 'wrap', // 줄바꿈
    marginTop: 20,
  },
  numberBox: {
    width: 30, // 박스의 너비
    height: 30, // 박스의 높이
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10, // 숫자들 간의 간격
    backgroundColor: '#f0f0f0', // 박스 배경색
    borderRadius: 4, // 박스의 모서리 둥글기
    borderWidth: 1, // 박스 테두리
    borderColor: '#ccc', // 테두리 색상
  },
  numberText: {
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 5,
  },
  footer: {
    height: 60,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

export default App;

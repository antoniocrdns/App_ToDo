import React from 'react';
import {
  TextInput,
  FlatList,
  Modal,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
  primary: '#6A4C9C', 
  secondary: '#D1D3D4', 
  white: '#fff',
  lightGray: '#f5f5f5',
  darkGray: '#a9a9a9',
  success: '#28a745',
  danger: '#dc3545',
};

const TodoApp = () => {
  const [todos, setTodos] = React.useState([]);
  const [textInput, setTextInput] = React.useState('');
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState('');
  const [onConfirm, setOnConfirm] = React.useState(null);

  React.useEffect(() => {
    getTodosFromUserDevice();
  }, []);

  React.useEffect(() => {
    saveTodoToUserDevice(todos);
  }, [todos]);

  const showModal = (message, confirmAction = null) => {
    setModalMessage(message);
    setOnConfirm(() => confirmAction);
    setModalVisible(true);
  };

  const addTodo = () => {
    if (textInput.trim() === '') {
      showModal('Por favor, ingrese una tarea válida');
    } else {
      const newTodo = {
        id: Math.random(),
        task: textInput.trim(),
        completed: false,
        dateTime: new Date().toLocaleString(),
      };
      setTodos([...todos, newTodo]);
      setTextInput('');
    }
  };

  const saveTodoToUserDevice = async (todos) => {
    try {
      const stringifyTodos = JSON.stringify(todos);
      await AsyncStorage.setItem('todos', stringifyTodos);
    } catch (error) {
      console.log(error);
    }
  };

  const getTodosFromUserDevice = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem('todos');
      if (storedTodos != null) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const markTodoComplete = (todoId) => {
    const updatedTodos = todos.map((item) => {
      if (item.id === todoId) {
        return { ...item, completed: true };
      }
      return item;
    });

    setTodos(updatedTodos);
  };

  const deleteTodo = (todoId) => {
    const updatedTodos = todos.filter((item) => item.id !== todoId);
    setTodos(updatedTodos);
  };

  const clearAllTodos = () => {
    showModal('¿Estás seguro de que deseas eliminar todas las tareas?', () => {
      setTodos([]);
      setModalVisible(false);
    });
  };

  const ListItem = ({ todo }) => (
    <TaskCard>
      <View style={{ flex: 1 }}>
        <TaskTitle
          style={{
            textDecorationLine: todo?.completed ? 'line-through' : 'none',
            color: todo?.completed ? COLORS.success : COLORS.primary,
          }}
        >
          {todo?.task}
        </TaskTitle>
        <TaskDateTime>{todo?.dateTime}</TaskDateTime>
      </View>
      {!todo?.completed && (
        <Icon
          name="done"
          size={20}
          color={COLORS.success}
          onPress={() => markTodoComplete(todo.id)}
        />
      )}
      <Icon
        name="delete"
        size={20}
        color={COLORS.danger}
        onPress={() => deleteTodo(todo.id)}
      />
    </TaskCard>
  );

  return (
    <Container>
      <Header>
        <Title>App De Tareas</Title>
        <Icon name="delete-sweep" size={25} color={COLORS.white} onPress={clearAllTodos} />
      </Header>
      <TaskList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ListItem todo={item} />}
      />
      <Footer>
        <InputContainer>
          <TextInput
            value={textInput}
            placeholder="Agregar tarea"
            onChangeText={(text) => setTextInput(text)}
            style={{
              height: 50,
              color: COLORS.primary,
              fontSize: 16,
              paddingHorizontal: 10,
            }}
          />
        </InputContainer>
        <IconContainer onPress={addTodo}>
          <Icon name="add" color={COLORS.white} size={30} />
        </IconContainer>
      </Footer>

      {/* Modal con Confirmación */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ModalBackground>
          <ModalBox>
            <ModalText>{modalMessage}</ModalText>
            <ButtonRow>
              <ModalButton onPress={() => setModalVisible(false)}>
                <ModalButtonText>Cancelar</ModalButtonText>
              </ModalButton>
              {onConfirm && (
                <ModalButton onPress={onConfirm}>
                  <ModalButtonText>Aceptar</ModalButtonText>
                </ModalButton>
              )}
            </ButtonRow>
          </ModalBox>
        </ModalBackground>
      </Modal>
    </Container>
  );
};

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${COLORS.lightGray};
  padding: 20px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${COLORS.primary};
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const Title = styled.Text`
  font-weight: bold;
  font-size: 24px;
  color: ${COLORS.white};
`;

const TaskList = styled(FlatList)`
  flex: 1;
`;

const TaskCard = styled.View`
  padding: 20px;
  background-color: ${COLORS.white};
  flex-direction: row;
  border-radius: 10px;
  margin: 10px 0;
  align-items: center;
  justify-content: space-between;
`;

const TaskTitle = styled.Text`
  font-weight: bold;
  font-size: 18px;
`;

const TaskDateTime = styled.Text`
  font-size: 14px;
  color: ${COLORS.secondary};
`;

const Footer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px 20px;
  background-color: ${COLORS.white};
`;

const InputContainer = styled.View`
  flex: 1;
  margin-right: 20px;
`;

const IconContainer = styled.TouchableOpacity`
  height: 50px;
  width: 50px;
  background-color: ${COLORS.primary};
  border-radius: 25px;
  justify-content: center;
  align-items: center;
`;

const ModalBackground = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalBox = styled.View`
  width: 80%;
  background-color: ${COLORS.white};
  padding: 20px;
  border-radius: 10px;
  align-items: center;
`;

const ModalText = styled.Text`
  font-size: 18px;
  color: ${COLORS.primary};
  margin-bottom: 20px;
  text-align: center;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const ModalButton = styled.TouchableOpacity`
  background-color: ${COLORS.primary};
  padding: 10px 20px;
  border-radius: 10px;
  flex: 1;
  margin: 0 5px;
  align-items: center;
`;

const ModalButtonText = styled.Text`
  color: ${COLORS.white};
  font-size: 16px;
`;

export default TodoApp;

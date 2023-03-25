import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import React from "react";

export default function InputField({
  label,
  icon,
  inputType,
  keyboardType,
  fieldButtonLabel,
  fieldButtonFunction,
}) {
  return (
    <View style={styles.container}>
      {icon}
      {inputType == "password" ? (
        <TextInput
          placeholder={label}
          keyboardType={keyboardType}
          style={styles.input}
          secureTextEntry={true}
        />
      ) : (
        <TextInput
          placeholder={label}
          style={styles.input}
          keyboardType={keyboardType}
        />
      )}
      <TouchableOpacity onPress={fieldButtonFunction}>
        <Text style={{ color: "#AD40AF", fontWeight: "700" }}>
          {fieldButtonLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
});
